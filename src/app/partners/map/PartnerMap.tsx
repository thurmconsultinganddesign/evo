'use client';

import { useEffect, useRef, useState } from 'react';
import type { RegenPartner } from '@/types';

// Ubud center coordinates
const UBUD_CENTER: [number, number] = [-8.5069, 115.2624];
const DEFAULT_ZOOM = 13;

export function PartnerMap({ partners }: { partners: RegenPartner[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
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

          // Popup with partner info and link
          marker.bindPopup(`
            <div style="font-family: Inter, system-ui, sans-serif; min-width: 180px;">
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #D4A843; margin-bottom: 4px;">${partner.category || ''}</div>
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 6px;">${partner.business_name}</div>
              ${partner.short_description ? `<div style="font-size: 12px; color: #666; margin-bottom: 8px;">${partner.short_description}</div>` : ''}
              <a href="/partners/${partner.id}" style="font-size: 12px; color: #D4A843; text-decoration: none;">View Details &rarr;</a>
            </div>
          `, { className: 'partner-popup' });

          // Tooltip on hover
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
        .partner-popup .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          color: #FAF7F2;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .partner-popup .leaflet-popup-tip {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .partner-popup .leaflet-popup-close-button {
          color: rgba(255,255,255,0.4) !important;
        }
        .partner-popup .leaflet-popup-close-button:hover {
          color: #FAF7F2 !important;
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

        {/* Partner count */}
        <div className="mt-4 text-cream/30 text-sm">
          {partners.length} partner{partners.length !== 1 ? 's' : ''} on the map
        </div>
      </div>
    </>
  );
}
