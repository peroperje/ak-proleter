import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Event } from '@/app/lib/definitions';
import { navItems } from '@/app/lib/routes';
import ClientEventMap from '@/app/components/events/ClientEventMap';
import { getEventById, Category } from '@/app/lib/actions';


// Helper function to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Define a type for the database event with included relations
type DbEventWithRelations = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  location: string;
  startDate: Date;
  endDate: Date | null;
  type: 'COMPETITION' | 'TRAINING' | 'CAMP' | 'MEETING' | 'OTHER';
  organizerId: string;
  lat: number | null;
  lng: number | null;
  organizer: {
    id: string;
    name: string;
    email: string;
    role: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  categories: {
    id: string;
    name: string;
    description: string;
    minAge: number;
    maxAge: number | null;
  }[];
};

async function fetchEventById(id: string): Promise<Event | null> {
  // Fetch event from the database by ID
  const dbEvent = await getEventById(id,{
    include: {
      organizer: true,
      categories: true,
    }
  }) as DbEventWithRelations | null;

  if (!dbEvent) {
    return null;
  }

  // Determine event status based on dates
  let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  const now = new Date();

  if (dbEvent.endDate && dbEvent.endDate < now) {
    status = 'completed';
  } else if (dbEvent.startDate > now) {
    status = 'upcoming';
  } else {
    status = 'ongoing';
  }

  return {
    id: dbEvent.id,
    name: dbEvent.title,
    description: dbEvent.description || '',
    location: dbEvent.location,
    startDate: dbEvent.startDate,
    endDate: dbEvent.endDate || dbEvent.startDate,
    type: dbEvent.type,
    category: dbEvent.categories && dbEvent.categories.length > 0 ? dbEvent.categories : null,
    status,
    organizer: dbEvent.organizer?.name || 'Unknown',
  };
}

export default async function EventPage({ params }: { params: { id: string } }) {
  // Fetch event from the database by ID
  const event = await fetchEventById(params.id);

  // If event not found, return 404
  if (!event) {
    notFound();
  }

  // Status badge styling
  const statusStyles = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ongoing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  // Event type badge styling
  const typeStyles = {
    COMPETITION: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    TRAINING: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    CAMP: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    MEETING: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  const editButton = (
    <Link href={`${navItems.events.href({id: event.id})}/edit`}>
      <Button variant="submit">Edit Event</Button>
    </Link>
  );

  return (
    <PageLayout title={event.name} action={editButton}>
      <Box
        icon={navItems.events.icon}
        title={() => {
          return <div className={'flex w-full items-center justify-between '}>
            <span>Event Details</span>
            <div className='mb-2 flex flex-wrap items-center justify-center gap-2'>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm leading-5 font-semibold ${typeStyles[event.type]}`}
              >
                {event.type.charAt(0) + event.type.toLowerCase().slice(1)}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm leading-5 font-semibold ${statusStyles[event.status]}`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>;
        }}
      >
        <div className='flex flex-col space-y-6'>
          {/* Header section with name, organizer, and badges */}
          <div className='mb-4 flex flex-col items-center space-y-2'>

            <h1 className='text-center text-2xl font-bold text-gray-900 dark:text-white'>
              {event.name}
            </h1>
            <p className='text-center text-lg text-gray-600 dark:text-neutral-400'>
              Organized by: {event.organizer}
            </p>
            {/* Map component */}
            <div className='h-[200px] w-full overflow-hidden rounded-md'>
              <ClientEventMap location={event.location} />
            </div>
          </div>

          {/* Event details grid */}
          <div className='grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-4 md:grid-cols-2 dark:bg-neutral-800'>
            {/* Date and time section */}
            <div className='flex flex-col space-y-2'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Date & Time
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500 dark:text-neutral-400'>
                    Start:
                  </p>
                  <p className='text-base text-gray-900 dark:text-white'>
                    {formatDate(event.startDate)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 dark:text-neutral-400'>
                    End:
                  </p>
                  <p className='text-base text-gray-900 dark:text-white'>
                    {formatDate(event.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Location section */}
            <div className='flex flex-col space-y-2'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Location
              </h3>
              <p className='text-base text-gray-900 dark:text-white'>
                {event.location}
              </p>
            </div>

            {/* Categories section */}
            <div className='flex flex-col space-y-2'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Categories
              </h3>
              <p className='text-base text-gray-900 dark:text-white'>
                {event.category && event.category.length > 0
                  ? event.category.map((cat: Category) => cat.name).join(', ')
                  : 'All categories'}
              </p>
            </div>

            {/* Description section */}
            <div className='flex flex-col space-y-2 md:col-span-2'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Description
              </h3>
              <p className='text-base whitespace-pre-wrap text-gray-900 dark:text-white'>
                {event.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className='mt-6 flex justify-center space-x-4'>
            <Link href={navItems.events.href()}>
              <Button variant='outline'>Back to Events</Button>
            </Link>
            <Link href={`${navItems.events.href({ id: event.id })}/edit`}>
              <Button variant='submit'>Edit Event</Button>
            </Link>
          </div>
        </div>
      </Box>
    </PageLayout>
  );
}
