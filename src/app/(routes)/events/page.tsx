import React from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Event } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import { navItems } from '@/app/lib/routes/index';
import EventCard from '@/app/components/events/EventCard';

async function getEvents(): Promise<Event[]> {
  // Fetch events from the database
  const dbEvents = await prisma.event.findMany({
    include: {
      organizer: true,
      categories: true,
    },
  });

  return dbEvents.map((event) => {
    // Determine event status based on dates
    let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    const now = new Date();

    if (event.endDate && event.endDate < now) {
      status = 'completed';
    } else if (event.startDate > now) {
      status = 'upcoming';
    } else {
      status = 'ongoing';
    }

    return {
      id: event.id,
      name: event.title,
      description: event.description || '',
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate || event.startDate,
      type: event.type,
      category:
        event.categories && event.categories.length > 0
          ? event.categories
          : null,
      status,
      organizer: event.organizer?.name || 'Unknown',
      notes: '',
    };
  });
}

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
      <Box icon={navItems.events.icon} title='Event List'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Box>
    </PageLayout>
  );
}
