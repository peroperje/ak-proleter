import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import CloseBtn from '@/app/components/CloseBtn';
import { navItems } from '@/app/lib/routes';

export default function LoadingNewEventPage() {
  return (
    <PageLayout
      title={'New Event'}
      currentPage='add event'
      action={<CloseBtn />}
    >
      <Box
        icon={navItems.events.icon}
        title="Loading form..."
      >
        <div className="animate-pulse">
          <div className="space-y-6">
            {/* Form fields skeleton */}
            {[...Array(10)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded"></div>
              </div>
            ))}

            {/* Date fields skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded"></div>
              </div>
            </div>

            {/* Categories skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                ))}
              </div>
            </div>

            {/* Button skeleton */}
            <div className="flex justify-end mt-6">
              <div className="h-10 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>
        </div>
      </Box>
    </PageLayout>
  );
}
