import React from 'react';
import Link from 'next/link';
import Button from '@/app/ui/button';
import { Event } from '@/app/lib/definitions';
import EventMap from './EventMap';

interface EventCardProps {
  event: Event;
}

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

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Status badge styling
  const statusStyles = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ongoing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  // Event type badge styling
  const typeStyles = {
    competition: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    training: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    camp: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };


  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-md dark:shadow-neutral-700/30 overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 flex flex-col h-full">

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${typeStyles[event.eventType]}`}>
            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
          </span>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[event.status]}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-lg text-center font-medium text-gray-900 dark:text-white">
            {event.name}
          </h3>
          <p className="text-sm text-center text-gray-500 dark:text-neutral-400">
            {event.organizer}
          </p>
        </div>
        {/* Map display */}
        <EventMap location={event.location} />

        {/* Location text */}
        <div className="text-sm mb-4">
          <span className="text-gray-500 dark:text-neutral-400">Location:</span>
          <span className="ml-1 text-xs text-gray-900 dark:text-white truncate block" title={event.location}>
            {event.location}
          </span>
        </div>



        <div className="grid grid-cols-2 gap-2 w-full mb-4 flex-grow">
          <div className="flex flex-col gap-0 text-sm">
            <span className="text-gray-500 dark:text-neutral-400">From:</span>
            <span className="ml-1 text-xs text-gray-900 dark:text-white">
              {formatDate(event.startDate)}
            </span>
          </div>
          <div className="flex flex-col gap-0 text-sm">
            <span className="text-gray-500 dark:text-neutral-400">To:</span>
            <span className="ml-1 text-xs  text-gray-900 dark:text-white">
              {formatDate(event.endDate)}
            </span>
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-gray-500 dark:text-neutral-400">Categories:</span>
            <span className="ml-1 text-gray-900 dark:text-white">
              {event.category && event.category.length > 0
                ? event.category.map(cat => cat.name).join(', ')
                : 'All categories'}
            </span>
          </div>
        </div>



        <div className="flex justify-center space-x-2">
          <Link href={`/events/${event.id}`}>
            <Button size="small" variant="outline">View</Button>
          </Link>
          <Link href={`/events/${event.id}/edit`}>
            <Button size="small" variant="outline">Edit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
