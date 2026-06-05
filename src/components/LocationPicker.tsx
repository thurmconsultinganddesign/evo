'use client';

import { useEffect, useRef, useState } from 'react';

const UBUD_CENTER: [number, number] = [-8.5069, 115.2624];
const DEFAULT_ZOOM = 13;

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number | null, lng: number | null) => void;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const center: [number, number] = latitude && longitude
        ? [latitude, longitude]
        : UBUD_CENTER;

      const map = L.map(mapRef.current!, {
        center,
        zoom: latitude && longitude ? 16 : DEFAULT_ZOOM,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      // Gold marker icon
      const goldIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 28px;
          height: 28px;
          background: #D4A843;
          border: 2px solid #FAF7F2;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      // Add existing marker if coordinates provided
      if (latitude && longitude) {
        markerRef.current = L.marker([latitude, longitude], { icon: goldIcon }).addTo(map);
      }

      // Click to place/move marker
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: goldIcon }).addTo(map);
        }

        onChange(lat, lng);
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search using Nominatim (OpenStreetMap)
  async function handleSearch(query: string) {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'json',
          limit: '5',
          viewbox: '115.15,-8.40,115.40,-8.60',
          bounded: '0',
        });

        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          headers: { 'Accept-Language': 'en' },
        });
        const data: SearchResult[] = await res.json();
        setSearchResults(data);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function selectResult(result: SearchResult) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current) {
      const L = (window as any).L;
      mapInstanceRef.current.setView([lat, lng], 16);

      const goldIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 28px;
          height: 28px;
          background: #D4A843;
          border: 2px solid #FAF7F2;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: goldIcon }).addTo(mapInstanceRef.current);
      }
    }

    onChange(lat, lng);
    setSearchQuery(result.display_name.split(',')[0]);
    setShowResults(false);
  }

  function clearLocation() {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    onChange(null, null);
  }

  return (
    <div className="space-y-3">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          placeholder="Search for a place..."
          className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-2.5 text-sm text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          </div>
        )}

        {/* Search results dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-dark-50 shadow-xl">
            {searchResults.map((result, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectResult(result)}
                className="w-full px-4 py-2.5 text-left text-sm text-cream/70 hover:bg-white/5 hover:text-cream transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-[300px] rounded-lg border border-white/5"
        style={{ background: '#111' }}
      />

      {!mapReady && (
        <p className="text-cream/30 text-xs">Loading map...</p>
      )}

      {/* Status */}
      <div className="flex items-center justify-between">
        <p className="text-cream/30 text-xs">
          {latitude && longitude
            ? `Location set: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : 'Search for a place or click on the map to set the location.'}
        </p>
        {latitude && longitude && (
          <button
            type="button"
            onClick={clearLocation}
            className="text-xs text-terracotta hover:text-terracotta-light transition-colors"
          >
            Clear location
          </button>
        )}
      </div>
    </div>
  );
}
