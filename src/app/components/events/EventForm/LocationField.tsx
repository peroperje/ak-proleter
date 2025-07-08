'use client';
import React, { ReactElement, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/app/ui/button';

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

// Create a client-side only MapEvents component
const MapEvents = dynamic(
  () => import('react-leaflet').then((mod) => {
    // Create and return a component that uses useMapEvents
    return function MapEventsComponent({
      onLocationSelect,
    }: {
      onLocationSelect: (lat: number, lng: number) => void;
    }) {
      const { useMapEvents } = mod;
      useMapEvents({
        click: (e) => {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
      });
      return null;
    };
  }),
  { ssr: false }
);

// Component to get map instance
const MapRef = dynamic(
  () => import('react-leaflet').then((mod) => {
    return function MapRefComponent({
      setMapRef,
    }: {
      setMapRef: (map: L.Map) => void;
    }) {
      const { useMap } = mod;
      const map = useMap();

      // Set map reference on mount
      useEffect(() => {
        setMapRef(map);
        return () => {
          setMapRef(null as never);
        };
      }, [map, setMapRef]);

      return null;
    };
  }),
  { ssr: false }
);

// Client-side only component for loading Leaflet CSS
const LeafletCSS: React.FC = () => {
  useEffect(() => {
    // Import CSS only on client side
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    import('leaflet/dist/leaflet.css');
  }, []);
  return null;
};

const LocationField: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = (props): ReactElement => {
  //const latitude = 45.3828; // Default to Zrenjanin coordinates
  //const longitude = 20.3875;
  const readOnly = props.readOnly || false;

  const [position, setPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [locationValue, setLocationValue] = useState<string>(props.defaultValue as string || '');
  const [isMounted, setIsMounted] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const customIconRef = useRef<null | L.Icon>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Function to set the map reference
  const setMapReference = (map: L.Map | null) => {
    mapRef.current = map;
  };

  // Only render the map on the client side
  useEffect(() => {
    setIsMounted(true);

    // Import Leaflet only on client side
    import('leaflet').then((L) => {
      // Fix Leaflet default icon issue
      // Delete the default icon
      //delete L.Icon.Default.prototype._getIconUrl;

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

      // Set icon as loaded
      setIconLoaded(true);
    });
  }, []);

  const handleLocationSelect = async (lat: number, lng: number) => {
    if (readOnly) return;
    setPosition([lat, lng]);
    // Update the location value with coordinates
    //const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
   // setLocationValue(locationString);

    try {
      // Perform reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();


      // The display_name property contains the full address
      const locationString = data.display_name;
      setLocationValue(locationString);
    } catch (error) {
      console.error('Error getting location address:', error);
      // Fallback to coordinates if reverse geocoding fails
      const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setLocationValue(locationString);
    }

  };



  // Function to search for a location using the input value
  const searchLocation = async () => {
    if (!locationValue.trim()) return;

    setIsSearching(true);
    try {
      // Use OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationValue)}`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        // Get the first result
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Update position
        setPosition([lat, lng]);
        setLocationValue(result.display_name)
        // Update map view
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 2);
        }
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationValue(e.target.value);
  };

  // Handle key press in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchLocation();
    }
  };

  return (
    <div className='flex w-full flex-col gap-2'>
      <input type='hidden' name={'lng'} value={position[1]} />
      <input type='hidden' name={'lat'} value={position[0]} />
      <input type='hidden' name={'location'} value={locationValue} />
      <div className='flex gap-2'>
        <input
          {...{ ...props, defaultValue:undefined}}
          id='location-search'
          name='location-search'
          value={locationValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <Button
          type='button'
          onClick={searchLocation}
          disabled={isSearching || readOnly}
          variant={'outline'}
          size={'small'}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {isMounted && position[0] !== 0 && position[1] !== 0 && (
        <>
          <div className='h-[400px] w-full'>
            <LeafletCSS />
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              className='h-full w-full'
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              {iconLoaded && (
                <Marker
                  position={position}
                  icon={customIconRef.current as L.Icon}
                >
                  <Popup>Event location</Popup>
                </Marker>
              )}
              {!readOnly && (
                <MapEvents onLocationSelect={handleLocationSelect} />
              )}
              <MapRef setMapRef={setMapReference} />
            </MapContainer>
          </div>
          <div className='flex justify-end gap-2'>
            <div className={'flex items-end gap-2'}>
              <h3 className='text-sm font-medium text-gray-500 dark:text-neutral-400'>
                lat
              </h3>
              <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                {position[0]}
              </p>
            </div>
            <div className={'flex items-end gap-2'}>
              <h3 className='text-sm font-medium text-gray-500 dark:text-neutral-400'>
                lng
              </h3>
              <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                {position[1]}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationField;
