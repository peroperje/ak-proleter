import React from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Event } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import { navItems } from '@/app/lib/routes';
import EventCard from '@/app/components/events/EventCard';

async function getEvents(): Promise<Event[]> {
  // Fetch events from the database
  const dbEvents = await prisma.event.findMany({
    include: {
      organizer: true,
      categories: true,
    }
  });

  return dbEvents.map(event => {
    // Determine event status based on dates
    let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';
    const now = new Date();

    if (event.endDate && event.endDate < now) {
      status = 'completed';
    } else if (event.startDate > now) {
      status = 'upcoming';
    } else {
      status = 'ongoing';
    }

    // Map event type from database enum to interface enum
    let eventType: 'competition' | 'training' | 'camp' | 'other';
    switch (event.type) {
      case 'COMPETITION':
        eventType = 'competition';
        break;
      case 'TRAINING':
        eventType = 'training';
        break;
      case 'CAMP':
        eventType = 'camp';
        break;
      case 'MEETING':
        eventType = 'camp'; // Keep backward compatibility for existing data
        break;
      default:
        eventType = 'other';
    }

    return {
      id: event.id,
      name: event.title,
      description: event.description || '',
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate || event.startDate,
      eventType,
      category: event.categories && event.categories.length > 0 ? event.categories : null,
      status,
      organizer: event.organizer?.name || 'Unknown',
      notes: ''
    };
  });
}

// Helper function to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function EventsPage() {
  // Fetch events from the database
  const events = await getEvents();

  const addEventButton = (
    <Link href="/events/new">
      <Button variant="submit">Add Event</Button>
    </Link>
  );

  return (
    <PageLayout
      title="Events"
      currentPage="events"
      action={addEventButton}
    >

          <Box
            icon={navItems.events.icon}
            title="Event List"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </Box>
    </PageLayout>
  );
}
