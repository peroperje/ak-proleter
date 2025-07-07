import React from 'react';

const AthletesCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-xs dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70 overflow-hidden">
      <div className="p-4 flex flex-col items-center">
        {/* Profile photo skeleton */}
        <div className="mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-neutral-700 animate-pulse" />
        </div>

        {/* Name and email skeleton */}
        <div className="text-center mb-4 w-full">
          <div className="h-5 w-32 mx-auto bg-gray-200 dark:bg-neutral-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 mx-auto bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Details skeleton */}
        <div className="grid grid-cols-2 gap-2 w-full mb-4">
          <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-full col-span-2 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Status skeleton */}
        <div className="mb-4 w-full">
          <div className="h-5 w-16 mx-auto bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex space-x-2">
          <div className="h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default AthletesCardSkeleton;
