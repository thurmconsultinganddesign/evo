'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { RegenPartner } from '@/types';

// Ubud center coordinates
const UBUD_CENTER: [number, number] = [-8.5069, 115.2624];
const DEFAULT_ZOOM = 13;

export function PartnerMap({ partners }: { partners: RegenPartner[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedPartner, setSelectedPartner] = useState<RegenPartner | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: UBUD_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: true,
      });

      // Use a dark/muted tile layer that matches the site aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom gold marker icon
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
        popupAnchor: [0, -28],
      });

      // Add partner markers
      partners.forEach((partner) => {
        if (partner.latitude && partner.longitude) {
          const marker = L.marker([partner.latitude, partner.longitude], {
            icon: goldIcon,
          }).addTo(map);

          marker.on('click', () => {
            setSelectedPartner(partner);
          });

          // Simple tooltip on hover
          marker.bindTooltip(partner.business_name, {
            direction: 'top',
            offset: [0, -30],
            className: 'partner-tooltip',
          });
        }
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
  }, [partners]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      <style>{`
        .partner-tooltip {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          color: #FAF7F2;
          font-family: Inter, system-ui, sans-serif;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .partner-tooltip::before {
          border-top-color: #1a1a1a !important;
        }
        .leaflet-control-zoom a {
          background: #1a1a1a !important;
          color: #FAF7F2 !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #222 !important;
        }
      `}</style>

      <div className="relative">
        {/* Map container */}
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-sm border border-white/5"
          style={{ background: '#111' }}
        />

        {/* Loading state */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-50 rounded-sm">
            <p className="text-cream/40 text-sm">Loading map...</p>
          </div>
        )}

        {/* Selected partner panel */}
        {selectedPartner && (
          <div className="absolute top-4 right-4 w-80 bg-dark/95 backdrop-blur-md border border-white/10 rounded-sm p-5 shadow-xl">
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-3 right-3 text-cream/40 hover:text-cream"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="inline-block text-xs px-2 py-0.5 bg-gold/10 text-gold border border-gold/20 rounded-sm mb-3">
              {selectedPartner.category}
            </span>

            <h3 className="font-serif text-lg text-cream mb-2">
              {selectedPartner.business_name}
            </h3>

            {selectedPartner.short_description && (
              <p className="text-cream/50 text-sm mb-4 leading-relaxed">
                {selectedPartner.short_description}
              </p>
            )}

            <Link
              href={`/partners/${selectedPartner.id}`}
              className="inline-block text-sm text-gold hover:text-gold-light transition-colors"
            >
              View Details &rarr;
            </Link>
          </div>
        )}

        {/* Partner count */}
        <div className="mt-4 text-cream/30 text-sm">
          {partners.length} partner{partners.length !== 1 ? 's' : ''} on the map
        </div>
      </div>
    </>
  );
}
