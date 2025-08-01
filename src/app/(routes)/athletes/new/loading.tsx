import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import CloseBtn from '@/app/components/CloseBtn';
import { UserPlusIcon } from '@/app/ui/icons';

export default function LoadingNewAthletePage() {
  return (
    <PageLayout title={'New Athlete'}>
      <CloseBtn />
      <Box icon={UserPlusIcon} title='Loading form...'>
        <div className='animate-pulse'>
          <div className='space-y-6'>
            {/* Form fields skeleton */}
            {[...Array(8)].map((_, index) => (
              <div key={index} className='space-y-2'>
                <div className='h-4 w-1/4 rounded bg-gray-200 dark:bg-neutral-700'></div>
                <div className='h-10 rounded bg-gray-200 dark:bg-neutral-700'></div>
              </div>
            ))}

            {/* Button skeleton */}
            <div className='mt-6 flex justify-end'>
              <div className='h-10 w-32 rounded bg-gray-200 dark:bg-neutral-700'></div>
            </div>
          </div>
        </div>
      </Box>
    </PageLayout>
  );
}
