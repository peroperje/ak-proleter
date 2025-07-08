import React from 'react';
import Link from 'next/link';
import Button from '@/app/ui/button';
import { Event } from '@/app/lib/definitions';

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

const EventCard: React.FC<EventCardProps> = ({
  event: {
    id,
    name,
    status,
    type,
    organizer,
    category,
    location,
    startDate,
    endDate,
  },
}) => {
  // Status badge styling
  const statusStyles = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ongoing:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  // Event type badge styling
  const typeStyles = {
    COMPETITION:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    TRAINING: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    CAMP: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    MEETING: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <div className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-md dark:shadow-neutral-700/30'>
      <div className='flex h-full flex-col p-4'>
        <div className='mb-4 flex flex-wrap items-center gap-2'>
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold lowercase first-letter:uppercase ${typeStyles[type]}`}
          >
            {type}
          </span>
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${statusStyles[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className='mb-4'>
          <h3 className='text-center text-lg font-medium text-gray-900 dark:text-white'>
            {name}
          </h3>
          <p className='text-center text-sm text-gray-500 dark:text-neutral-400'>
            {organizer}
          </p>
        </div>

        {/* Location text */}
        <div className='mb-4 text-sm'>
          <span className='text-gray-500 dark:text-neutral-400'>Location:</span>
          <span
            className='ml-1 block truncate text-xs text-gray-900 dark:text-white'
            title={location}
          >
            {location}
          </span>
        </div>

        <div className='mb-4 grid w-full flex-grow grid-cols-2 gap-2'>
          <div className='flex flex-col gap-0 text-sm'>
            <span className='text-gray-500 dark:text-neutral-400'>From:</span>
            <span className='ml-1 text-xs text-gray-900 dark:text-white'>
              {formatDate(startDate)}
            </span>
          </div>
          <div className='flex flex-col gap-0 text-sm'>
            <span className='text-gray-500 dark:text-neutral-400'>To:</span>
            <span className='ml-1 text-xs text-gray-900 dark:text-white'>
              {formatDate(endDate)}
            </span>
          </div>
          <div className='flex flex-col text-sm'>
            <span className='text-gray-500 dark:text-neutral-400'>
              Categories:
            </span>
            <span className='ml-1 text-gray-900 dark:text-white'>
              {category && category.length > 0
                ? category.map((cat) => cat.name).join(', ')
                : 'All categories'}
            </span>
          </div>
        </div>

        <div className='flex justify-center space-x-2'>
          <Link href={`/events/${id}`}>
            <Button size='small' variant='outline'>
              View
            </Button>
          </Link>
          <Link href={`/events/${id}/edit`}>
            <Button size='small' variant='outline'>
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
