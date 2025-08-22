'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: {
    id: string;
    position: [number, number];
    title: string;
    description?: string;
    onClick?: () => void;
  }[];
  className?: string;
  height?: string;
}

export default function Map({ 
  center = [48.8566, 2.3522], // Paris default
  zoom = 2, 
  markers = [], 
  className = '',
  height = '400px'
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg overflow-hidden"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={customIcon}
            eventHandlers={{
              click: marker.onClick
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">{marker.title}</h3>
                {marker.description && (
                  <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}