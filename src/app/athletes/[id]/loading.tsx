import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import CloseBtn from '@/app/components/CloseBtn';

export default function LoadingAthletePage() {
  return (
    <PageLayout
      title={''}
      currentPage="athletes"
      action={<CloseBtn />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information Skeleton */}
        <div className="md:col-span-1">
          <Box
            icon={'running'}
            title="Profile Information"
          >
            <div className="flex flex-col md:flex-row items-start mb-6">
              <div className="mr-4 mb-4 md:mb-0">
                {/* Avatar skeleton */}
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>
                <div className="mt-2 text-center">
                  {/* Status badge skeleton */}
                  <div className="h-5 w-16 bg-gray-200 dark:bg-neutral-700 rounded-full mx-auto animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-col flex-auto gap-3">
                {/* Name skeleton */}
                <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>

                <div className="flex flex-wrap gap-4">
                  {/* Age skeleton */}
                  <div className="flex flex-col flex-auto gap-0">
                    <div className="h-4 w-8 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                    <div className="mt-1 h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  </div>

                  {/* Gender skeleton */}
                  <div className="flex flex-col flex-auto gap-0">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                    <div className="mt-1 h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  </div>

                  {/* Date of Birth skeleton */}
                  <div className="flex flex-col flex-auto gap-0">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                    <div className="mt-1 h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  </div>

                  {/* Categories skeleton */}
                  <div className="flex flex-col flex-auto gap-0">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                    <div className="mt-1 h-4 w-28 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>

        {/* Contacts Skeleton */}
        <div className="md:col-span-1">
          <Box
            title="Contacts"
            icon={'mail'}
          >
            <div className="flex justify-between flex-wrap gap-4 md:gap-6">
              {/* Phone skeleton */}
              <div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="mt-1 h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>

              {/* Email skeleton */}
              <div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="mt-1 h-4 w-40 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>

              {/* Address skeleton */}
              <div className="md:col-span-2">
                <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="mt-1 h-4 w-48 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </PageLayout>
  );
}
