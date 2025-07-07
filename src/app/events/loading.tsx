import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import { navItems } from '@/app/lib/routes';

export default function LoadingEventsPage() {
  return (
    <PageLayout
      title="Events"
      currentPage="events"
    >
      <Box
        icon={navItems.events.icon}
        title="Event List"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Categories
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-900 dark:divide-neutral-700">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <div className="h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                      <div className="h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </PageLayout>
  );
}
