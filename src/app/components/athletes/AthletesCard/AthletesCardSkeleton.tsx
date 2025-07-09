import React from 'react';

const AthletesCardSkeleton: React.FC = () => {
  return (
    <div className='flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70'>
      <div className='flex flex-col items-center p-4'>
        {/* Profile photo skeleton */}
        <div className='mb-4'>
          <div className='h-20 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700' />
        </div>

        {/* Name and email skeleton */}
        <div className='mb-4 w-full text-center'>
          <div className='mx-auto mb-2 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='mx-auto h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
        </div>

        {/* Details skeleton */}
        <div className='mb-4 grid w-full grid-cols-2 gap-2'>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='col-span-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
        </div>

        {/* Status skeleton */}
        <div className='mb-4 w-full'>
          <div className='mx-auto h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700' />
        </div>

        {/* Buttons skeleton */}
        <div className='flex space-x-2'>
          <div className='h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
          <div className='h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700' />
        </div>
      </div>
    </div>
  );
};

export default AthletesCardSkeleton;
