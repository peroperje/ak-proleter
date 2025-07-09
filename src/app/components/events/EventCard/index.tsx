import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/app/lib/definitions';
import { routes } from '@/app/lib/routes/index';
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
    /*hour: '2-digit',
    minute: '2-digit',*/
  });
}
function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-GB', {
    /*day: '2-digit',
    month: '2-digit',
    year: 'numeric',*/
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface NoteBoxBgProps {
  type: Event['type'];
  className?: string;
}

const NoteBoxBg: React.FC<PropsWithChildren<NoteBoxBgProps>> = ({
  children,
  type,
  className,
}) => {
  return (
    <div
      className={`mb-4 rounded-lg p-2 shadow-md transition-shadow duration-300 hover:shadow-lg ${className} ${eventTypeStyles[type]}`}
    >
      {children}
    </div>
  );
};

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
        href={routes.events.edit(id)}
        passHref={true}
      >
        <IconComponent />
      </Link>
      <Link href={routes.events.detail(id)} passHref={true}>
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

            <NoteBoxBg type={type}>
              <h3 className='text-center text-lg font-medium text-gray-900 dark:text-white'>
                {name}
              </h3>
              <p className='text-center text-sm text-gray-500 dark:text-neutral-400'>
                {organizer}
              </p>
            </NoteBoxBg>

            {/* Location text */}
            <NoteBoxBg type={type}>
              <span className='flex items-center text-gray-500 dark:text-neutral-400'>
                <LocationIcon className='mr-1' size={16} /> Location:
              </span>
              <span
                className='ml-1 block truncate text-xs font-bold text-gray-500 dark:text-neutral-400'
                title={location}
              >
                {location}
              </span>
            </NoteBoxBg>

            <NoteBoxBg type={type}>
              <div className='grid w-full flex-grow grid-cols-2 gap-2'>
                <div className='flex flex-col gap-1 text-sm'>
                  <span className=' text-gray-500 dark:text-neutral-400'>
                  From:
                  </span>
                  <span className='flex items-center text-xs font-bold text-gray-500 dark:text-neutral-400'>
                    <DateFromIcon className='mr-1' size={16} /> {formatDate(startDate)}
                  </span>
                  <span className='flex items-center text-xs font-bold text-gray-500 dark:text-neutral-400'>
                    <DateToIcon className='mr-1' size={16} /> {formatTime(startDate)}
                  </span>

                </div>
                <div className='flex flex-col gap-1 text-sm'>
                  <span className='text-gray-500 dark:text-neutral-400'>
                  To:
                  </span>

                  <span className='flex items-center ml-1 text-xs font-bold text-gray-500 dark:text-neutral-400'>
                    <DateFromIcon className='mr-1' size={16} /> {formatDate(endDate)}
                  </span>
                  <span className='flex items-center ml-1 text-xs font-bold text-gray-500 dark:text-neutral-400'>
                    <DateToIcon className='mr-1' size={16} /> {formatTime(endDate)}
                  </span>
                </div>
              </div>
            </NoteBoxBg>
            <NoteBoxBg type={type} className={'text-sm'}>
              <span className='flex items-center text-gray-500 dark:text-neutral-400'>
                <CategoriesIcon className='mr-1' size={16} /> Categories:
              </span>
              <span className='font-bold text-gray-500 dark:text-neutral-400'>
                {category && category.length > 0
                  ? category.map((cat) => cat.name).join(', ')
                  : 'All categories'}
              </span>
            </NoteBoxBg>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
