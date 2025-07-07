import React from 'react';

const EventCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-xs dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70 overflow-hidden h-full">
      <div className="p-4 flex flex-col h-full">
        {/* Event name and organizer skeleton */}
        <div className="mb-4">
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Event details skeleton */}
        <div className="grid grid-cols-1 gap-2 w-full mb-4 flex-grow">
          <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Event type and status badges skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-5 w-24 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex space-x-2 mt-auto">
          <div className="h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
