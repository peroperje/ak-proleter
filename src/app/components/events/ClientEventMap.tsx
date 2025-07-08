'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import EventMap component with SSR disabled
const EventMap = dynamic(
  () => import('@/app/components/events/EventMap'),
  { ssr: false }
);

interface ClientEventMapProps {
  location: string;
}

const ClientEventMap: React.FC<ClientEventMapProps> = ({ location }) => {
  return <EventMap location={location} />;
};

export default ClientEventMap;
