import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import EventCardSkeleton from '@/app/components/events/EventCard/EventCardSkeleton';
import { CalendarIcon } from '@/app/lib/icons';

export default function LoadingEventsPage() {
  return (
    <PageLayout title='Events'>
      <Box icon={CalendarIcon} title='Event List'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {[...Array(8)].map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </Box>
    </PageLayout>
  );
}
