import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, Compass } from 'lucide-react';
import type { CampusLocation, WasteCategory } from '../types';

interface InteractiveMapProps {
  locations: CampusLocation[];
  activeLocationId?: string | null;
  scannedCategory?: WasteCategory | null;
  onSelectLocation?: (id: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  activeLocationId,
  scannedCategory,
  onSelectLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>('Location access off');

  // Request browser geolocation safely
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setGeoStatus('GPS location acquired');
        },
        (_err) => {
          setGeoStatus('Location access off (Browsing campus map view)');
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = 28.5450;
      const initialLng = 77.1926;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Render Markers for all campus locations
    locations.forEach((loc) => {
      const isSelected = activeLocationId === loc.id;
      const isMatch = scannedCategory && loc.acceptedTypes.includes(scannedCategory);

      let colorClass = 'bg-stone-800 text-white';
      let iconEmoji = '📍';

      if (loc.acceptedTypes.includes('ewaste')) {
        colorClass = 'bg-purple-600 text-white';
        iconEmoji = '⚡';
      } else if (loc.acceptedTypes.includes('recyclable')) {
        colorClass = 'bg-blue-600 text-white';
        iconEmoji = '♻️';
      } else if (loc.acceptedTypes.includes('wet')) {
        colorClass = 'bg-emerald-600 text-white';
        iconEmoji = '🌱';
      } else if (loc.acceptedTypes.includes('dry')) {
        colorClass = 'bg-amber-600 text-white';
        iconEmoji = '🗑️';
      }

      const iconHtml = `
        <div class="relative flex items-center justify-center">
          ${isSelected ? '<div class="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping"></div>' : ''}
          <div class="w-9 h-9 rounded-full ${colorClass} font-black text-sm flex items-center justify-center shadow-lg border-2 ${isSelected ? 'border-white scale-110 ring-4 ring-emerald-600' : 'border-white'} transition-all">
            ${iconEmoji}
          </div>
          ${isMatch ? '<span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border border-white"></span>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #059669; margin-bottom: 2px;">
            ${loc.operatingStatus.toUpperCase()} • ${loc.distanceMeterText}
          </div>
          <div style="font-size: 14px; font-weight: 900; color: #1c1917;">${loc.name}</div>
          <div style="font-size: 11px; color: #57534e; margin-bottom: 6px;">${loc.building}</div>
          <div style="font-size: 11px; font-weight: 600; color: #15803d; margin-bottom: 4px;">📍 ${loc.mapLandmark}</div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectLocation) {
          onSelectLocation(loc.id);
        }
      });

      markersRef.current[loc.id] = marker;
    });

    // Center map on active location if specified
    if (activeLocationId && locations.find((l) => l.id === activeLocationId)) {
      const activeLoc = locations.find((l) => l.id === activeLocationId)!;
      map.setView([activeLoc.lat, activeLoc.lng], 17);
      if (markersRef.current[activeLoc.id]) {
        markersRef.current[activeLoc.id].openPopup();
      }
    }

    // Render user location marker if available
    if (userCoords) {
      const userIcon = L.divIcon({
        html: `
          <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          </div>
        `,
        className: 'user-leaflet-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>You are here</b>');
    }
  }, [locations, activeLocationId, scannedCategory, userCoords]);

  return (
    <div className="w-full space-y-3">
      {/* Map Header Status */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-stone-100 border border-stone-300 text-xs">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>Interactive Campus Leaflet Map (OpenStreetMap)</span>
        </div>
        <div className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-stone-400" />
          <span>{geoStatus}</span>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-stone-300 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
      </div>

      {/* Stream Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-stone-700 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600" />
          <span>♻️ Recyclable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600" />
          <span>🌱 Wet / Organic</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-600" />
          <span>⚡ E-Waste</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-600" />
          <span>🗑️ Dry Waste</span>
        </div>
      </div>
    </div>
  );
};
