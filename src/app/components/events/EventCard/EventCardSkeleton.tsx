import React from 'react';

const EventCardSkeleton: React.FC = () => {
  return (
    <div className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70'>
      <div className='flex h-full flex-col p-4'>
        {/* Event name and organizer skeleton */}
        <div className='mb-4'>
          <div className='mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
        </div>

        {/* Event details skeleton */}
        <div className='mb-4 grid w-full flex-grow grid-cols-1 gap-2'>
          <div className='h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
        </div>

        {/* Event type and status badges skeleton */}
        <div className='mb-4 flex flex-wrap gap-2'>
          <div className='h-5 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700' />
          <div className='h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700' />
        </div>

        {/* Buttons skeleton */}
        <div className='mt-auto flex space-x-2'>
          <div className='h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
