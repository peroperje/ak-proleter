import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import { navItems } from '@/app/lib/routes';
import CloseBtn from '@/app/components/CloseBtn';

export default function LoadingNewAthletePage() {
  return (
    <PageLayout title={'New Athlete'}>
      <CloseBtn />
      <Box
        icon={'addUser'}
        title="Loading form..."
      >
        <div className="animate-pulse">
          <div className="space-y-6">
            {/* Form fields skeleton */}
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded"></div>
              </div>
            ))}

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
