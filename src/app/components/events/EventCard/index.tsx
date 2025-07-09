import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/app/lib/definitions';
import { navItems } from '@/app/lib/routes';
import { icons } from '@/app/lib/icons';
import { eventStatusStyles, eventTypeStyles } from '@/app/lib/constants/styles';

const IconComponent = icons.edit;
const LocationIcon = icons.location;
const DateFromIcon = icons.dateFrom;
const DateToIcon = icons.dateTo;
const CategoriesIcon = icons.categories;

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

  return (
    <div className='relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-md dark:shadow-neutral-700/30'>
      <Link
        className={'absolute top-1 right-1 z-20 p-3'}
        href={`${navItems.events.href({ id })}/edit`}
        passHref={true}
      >
        <IconComponent />
      </Link>
      <Link href={navItems.events.href({ id })}>
        <div className='flex h-full flex-col'>
          <div className='p-4'>
            <div className='mb-4 flex flex-wrap items-center gap-2 py-2'>
              <div className='relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-500 shadow-lg'>
                <Image
                  src={`/event-img/${type}.png`}
                  alt={`${type} event`}
                  fill
                  className='object-contain p-1'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${eventTypeStyles[type]}`}
              >
                {type.charAt(0) + type.toLowerCase().slice(1)}
              </span>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${eventStatusStyles[status]}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <div className={`mb-4 rounded-lg  p-2 ${eventTypeStyles[type]}`}>
              <h3 className='text-center text-lg font-medium text-gray-900 dark:text-white'>
                {name}
              </h3>
              <p className='text-center text-sm text-gray-500 dark:text-neutral-400'>
                {organizer}
              </p>
            </div>

            {/* Location text */}
            <div className='mb-4 text-sm'>
              <span className='flex items-center text-gray-500 dark:text-neutral-400'>
                <LocationIcon className='mr-1' size={16} /> Location:
              </span>
              <span
                className='ml-1 block truncate text-xs font-bold text-gray-500 dark:text-neutral-400'
                title={location}
              >
                {location}
              </span>
            </div>

            <div className='mb-4 grid w-full flex-grow grid-cols-2 gap-2'>
              <div className='flex flex-col gap-0 text-sm'>
                <span className='flex items-center text-gray-500 dark:text-neutral-400'>
                  <DateFromIcon className='mr-1' size={16} /> From:
                </span>
                <span className='ml-1 text-xs font-bold text-gray-500 dark:text-neutral-400'>
                  {formatDate(startDate)}
                </span>
              </div>
              <div className='flex flex-col gap-0 text-sm'>
                <span className='flex items-center text-gray-500 dark:text-neutral-400'>
                  <DateToIcon className='mr-1' size={16} /> To:
                </span>
                <span className='ml-1 text-xs font-bold text-gray-500 dark:text-neutral-400'>
                  {formatDate(endDate)}
                </span>
              </div>
              <div className='flex flex-col text-sm'>
                <span className='flex items-center text-gray-500 dark:text-neutral-400'>
                  <CategoriesIcon className='mr-1' size={16} /> Categories:
                </span>
                <span className='ml-1 font-bold text-gray-500 dark:text-neutral-400'>
                  {category && category.length > 0
                    ? category.map((cat) => cat.name).join(', ')
                    : 'All categories'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
