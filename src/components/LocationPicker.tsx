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
  const [searchError, setSearchError] = useState('');

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

      const goldIcon = createGoldIcon(L);

      if (latitude && longitude) {
        markerRef.current = L.marker([latitude, longitude], { icon: goldIcon }).addTo(map);
      }

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng, map, L);
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

  function createGoldIcon(L: any) {
    return L.divIcon({
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
  }

  function placeMarker(lat: number, lng: number, map?: any, L?: any) {
    const m = map || mapInstanceRef.current;
    const leaflet = L || (window as any).L;
    if (!m || !leaflet) return;

    const icon = createGoldIcon(leaflet);
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = leaflet.marker([lat, lng], { icon }).addTo(m);
    }
  }

  async function doSearch() {
    const query = searchQuery.trim();
    if (query.length < 2) return;

    setSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const encoded = encodeURIComponent(query);
      const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5&countrycodes=id`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: SearchResult[] = await res.json();

      if (data.length === 0) {
        setSearchError('No results found. Try a different search term.');
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Location search error:', err);
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  }

  function selectResult(result: SearchResult) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      placeMarker(lat, lng);
    }

    onChange(lat, lng);
    setSearchQuery(result.display_name.split(',')[0]);
    setSearchResults([]);
  }

  function clearLocation() {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    onChange(null, null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  }

  return (
    <div className="space-y-3">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      {/* Search bar with button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a place (e.g. Mana Earthly Paradise)..."
          className="flex-1 rounded-lg border border-dark-300 bg-dark-100 px-4 py-2.5 text-sm text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button
          type="button"
          onClick={doSearch}
          disabled={searching || searchQuery.trim().length < 2}
          className="rounded-lg bg-gold/20 border border-gold/30 px-4 py-2.5 text-sm text-gold hover:bg-gold/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-dark-50 overflow-hidden">
          {searchResults.map((result, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectResult(result)}
              className="w-full px-4 py-3 text-left text-sm text-cream/70 hover:bg-white/5 hover:text-cream transition-colors border-b border-white/5 last:border-b-0"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Search error */}
      {searchError && (
        <p className="text-sm text-terracotta">{searchError}</p>
      )}

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
