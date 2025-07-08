import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import { navItems } from '@/app/lib/routes';
import EventCardSkeleton from '@/app/components/events/EventCard/EventCardSkeleton';

export default function LoadingEventsPage() {
  return (
    <PageLayout
      title="Events"
    >
      <Box
        icon={navItems.events.icon}
        title="Event List"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </Box>
    </PageLayout>
  );
}
