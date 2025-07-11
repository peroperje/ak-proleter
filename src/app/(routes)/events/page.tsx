import React from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import EventCard from '@/app/components/events/EventCard';
import { CalendarIcon } from '@/app/ui/icons';
import { getEvents } from '@/app/lib/actions';

export default async function EventsPage() {
  // Fetch events from the database
  const events = await getEvents();

  const addEventButton = (
    <Link href='/events/new'>
      <Button variant='submit'>Add Event</Button>
    </Link>
  );

  return (
    <PageLayout title='Events' action={addEventButton}>
      <Box icon={CalendarIcon} title='Event List'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Box>
    </PageLayout>
  );
}
