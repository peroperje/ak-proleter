'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { DivIcon } from 'leaflet';

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Client-side only component for loading Leaflet CSS
const LeafletCSS: React.FC = () => {
  useEffect(() => {
    // @ts-expect-error treed parts error
    import('leaflet/dist/leaflet.css');
  }, []);
  return null;
};

interface EventMapProps {
  location: string;
}

const EventMap: React.FC<EventMapProps> = ({ location }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const customIconRef = useRef<null | L.Icon>(null);

  // Initialize map and geocode location
  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);

    // Geocode the location to get coordinates
    const geocodeLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          setPosition([lat, lng]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error geocoding location:', error);
        setIsLoading(false);
      }
    };

    // Import Leaflet and set up icon
    import('leaflet').then((L) => {
      // Set up the new icon paths
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create a custom marker icon
      customIconRef.current = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      setIconLoaded(true);
      geocodeLocation();
    });
  }, [location]);

  if (isLoading) {
    return (
      <div className="w-full h-[150px] mb-4 rounded-md overflow-hidden bg-gray-200 dark:bg-neutral-700 animate-pulse">
        {/* Map skeleton with some landmark indicators */}
        <div className="h-full w-full relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-300 dark:bg-neutral-600"></div>
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-sm bg-gray-300 dark:bg-neutral-600"></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-sm bg-gray-300 dark:bg-neutral-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[150px] mb-4 rounded-md overflow-hidden">
      {isMounted && position && (
        <>
          <LeafletCSS />
          <MapContainer
            center={position}
            zoom={8}
            scrollWheelZoom={false}
            className="h-full w-full"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {iconLoaded && (
              <Marker position={position} icon={customIconRef.current as DivIcon}>
                <Popup>{location}</Popup>
              </Marker>
            )}
          </MapContainer>
        </>
      )}
    </div>
  );
};

export default EventMap;
