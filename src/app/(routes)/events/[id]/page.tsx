import React, { use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import { Event } from '@/app/lib/definitions';
import { MapPinIcon, CalendarIcon, ClockIcon, TagIcon } from '@/app/lib/icons';
import ClientEventMap from '@/app/components/events/ClientEventMap';
import { getEventById, Category } from '@/app/lib/actions';
import CloseBtn from '@/app/components/CloseBtn';
import { eventStatusStyles, eventTypeStyles } from '@/app/lib/constants/styles';

const LocationIcon = MapPinIcon;
const DateFromIcon = CalendarIcon;
const DateToIcon = ClockIcon;
const CategoriesIcon = TagIcon;

// Helper function to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Helper function to format time
function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-GB', {
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
  const dbEvent = (await getEventById(id, {
    include: {
      organizer: true,
      categories: true,
    },
  })) as DbEventWithRelations | null;

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
    category:
      dbEvent.categories && dbEvent.categories.length > 0
        ? dbEvent.categories
        : null,
    status,
    organizer: dbEvent.organizer?.name || 'Unknown',
  };
}

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function EventPage({ params }: EventPageProps) {
  const { id } = use(params);
  // Fetch event from the database by ID
  const event = use(fetchEventById(id));

  // If event not found, return 404
  if (!event) {
    notFound();
  }
  return (
    <PageLayout title={event.name} action={<CloseBtn />}>
      <Box
        title={() => {
          return (
            <div className={'flex w-full items-center gap-2'}>
              <div className='relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-500 shadow-lg'>
                <Image
                  src={`/event-img/${event.type}.png`}
                  alt={`${event.type} event`}
                  fill
                  className='object-contain p-1'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm leading-5 font-semibold ${eventTypeStyles[event.type]}`}
              >
                {event.type.charAt(0) + event.type.toLowerCase().slice(1)}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm leading-5 font-semibold ${eventStatusStyles[event.status]}`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          );
        }}
      >
        <div className='flex flex-col space-y-6'>
          {/* Header section with name, organizer, and badges */}
          <div className='mb-4 flex flex-col items-center space-y-0'>
            <h1 className='text-center text-2xl font-bold text-gray-900 dark:text-white'>
              {event.name}
            </h1>
            <p className='text-center text-sm text-gray-500 dark:text-neutral-400'>
              Organized by: {event.organizer}
            </p>
          </div>
          <div className='mb-4 flex flex-col items-center space-y-0'>
            <p className='flex items-center justify-center text-sm font-bold text-gray-500 dark:text-neutral-400'>
              <LocationIcon className='mr-1' size={16} /> {event.location}
            </p>
            {/* Map component */}
            <div className='h-[200px] w-full overflow-hidden rounded-md'>
              <ClientEventMap location={event.location} />
            </div>
          </div>

          {/* Event details grid */}
          <div className='grid grid-cols-1 gap-6 rounded-lg p-4 md:grid-cols-1 dark:bg-neutral-800'>
            {/* Date and time section */}

            <div className='flex w-full flex-wrap gap-4'>
              <div className={'flex-auto rounded-md bg-gray-50 p-3'}>
                <p className='text-sm text-gray-500 dark:text-neutral-400'>
                  Start:
                </p>
                <p className='flex items-center text-sm font-bold text-gray-500 dark:text-neutral-400'>
                  <DateFromIcon className='mr-1' size={16} />{' '}
                  {formatDate(event.startDate)}
                </p>
                <p className='flex items-center text-sm font-bold text-gray-500 dark:text-neutral-400'>
                  <DateToIcon className='mr-1' size={16} />{' '}
                  {formatTime(event.startDate)}
                </p>
              </div>
              <div className={'flex-auto rounded-md bg-gray-50 p-3'}>
                <p className='flex items-center text-sm text-gray-500 dark:text-neutral-400'>
                  End:
                </p>
                <p className='flex items-center text-sm font-bold text-gray-500 dark:text-neutral-400'>
                  <DateFromIcon className='mr-1' size={16} />{' '}
                  {formatDate(event.endDate)}
                </p>
                <p className='flex items-center text-sm font-bold text-gray-500 dark:text-neutral-400'>
                  <DateToIcon className='mr-1' size={16} />{' '}
                  {formatTime(event.endDate)}
                </p>
              </div>

              {/* Categories section */}
              <div className={'flex-auto rounded-md bg-gray-50 p-3'}>
                <p className='flex items-center text-sm text-gray-500 dark:text-neutral-400'>
                  <CategoriesIcon className='mr-1' size={16} /> Categories
                </p>
                <p className='text-sm font-bold text-gray-500 dark:text-neutral-400'>
                  {event.category && event.category.length > 0
                    ? event.category.map((cat: Category) => cat.name).join(', ')
                    : 'All categories'}
                </p>
              </div>
            </div>
            {/* Description section */}
            <div className='flex flex-col space-y-2 rounded-md p-3 md:col-span-2'>
              <p className='text-sm whitespace-pre-wrap text-gray-500 dark:text-neutral-400'>
                {event.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </Box>
    </PageLayout>
  );
}
