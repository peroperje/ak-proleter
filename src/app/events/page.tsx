import React from 'react';
import Link from 'next/link';
import Box from '@/app/views/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Event, Discipline } from '@/app/lib/definitions';

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'National Championship 2023',
    description: 'Annual national track and field championship',
    location: 'Belgrade Stadium, Belgrade',
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-06-17'),
    eventType: 'competition',
    disciplines: [
      { id: '101', name: '100m Sprint', category: 'sprint', measurementUnit: 'time', genderCategory: 'male' },
      { id: '102', name: '200m Sprint', category: 'sprint', measurementUnit: 'time', genderCategory: 'male' },
      { id: '103', name: 'Long Jump', category: 'jumps', measurementUnit: 'distance', genderCategory: 'male' },
      { id: '104', name: '100m Sprint', category: 'sprint', measurementUnit: 'time', genderCategory: 'female' },
      { id: '105', name: '200m Sprint', category: 'sprint', measurementUnit: 'time', genderCategory: 'female' },
      { id: '106', name: 'Long Jump', category: 'jumps', measurementUnit: 'distance', genderCategory: 'female' },
    ],
    status: 'completed',
    organizer: 'Serbian Athletics Federation',
  },
  {
    id: '2',
    name: 'Spring Training Camp',
    description: 'Intensive training camp for club athletes',
    location: 'Zrenjanin Sports Center, Zrenjanin',
    startDate: new Date('2023-03-10'),
    endDate: new Date('2023-03-20'),
    eventType: 'camp',
    disciplines: [
      { id: '201', name: 'Sprint Training', category: 'sprint', measurementUnit: 'time', genderCategory: 'mixed' },
      { id: '202', name: 'Endurance Training', category: 'middle-distance', measurementUnit: 'time', genderCategory: 'mixed' },
      { id: '203', name: 'Strength Training', category: 'throws', measurementUnit: 'distance', genderCategory: 'mixed' },
    ],
    status: 'completed',
    organizer: 'AK Proleter',
  },
  {
    id: '3',
    name: 'Regional Competition 2023',
    description: 'Regional qualification event',
    location: 'Novi Sad Athletics Stadium, Novi Sad',
    startDate: new Date('2023-09-05'),
    endDate: new Date('2023-09-06'),
    eventType: 'competition',
    disciplines: [
      { id: '301', name: '400m', category: 'sprint', measurementUnit: 'time', genderCategory: 'male' },
      { id: '302', name: '800m', category: 'middle-distance', measurementUnit: 'time', genderCategory: 'male' },
      { id: '303', name: '1500m', category: 'middle-distance', measurementUnit: 'time', genderCategory: 'male' },
      { id: '304', name: '400m', category: 'sprint', measurementUnit: 'time', genderCategory: 'female' },
      { id: '305', name: '800m', category: 'middle-distance', measurementUnit: 'time', genderCategory: 'female' },
      { id: '306', name: '1500m', category: 'middle-distance', measurementUnit: 'time', genderCategory: 'female' },
    ],
    status: 'upcoming',
    organizer: 'Vojvodina Athletics Association',
  },
];

// Helper function to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function EventsPage() {
  const addEventButton = (
    <Link href="/events/new">
      <Button variant="submit">Add Event</Button>
    </Link>
  );

  return (
    <PageLayout
      title="Events"
      currentPage="events"
      action={addEventButton}
    >

          <Box title="Event List">
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
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-900 dark:divide-neutral-700">
                  {mockEvents.map((event) => {
                    // Status badge styling
                    const statusStyles = {
                      upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                      ongoing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                    };

                    // Event type badge styling
                    const typeStyles = {
                      competition: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                      training: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
                      camp: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
                      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
                    };

                    return (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {event.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-neutral-400">
                                {event.organizer}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatDate(event.startDate)}
                          </div>
                          {event.startDate.toDateString() !== event.endDate.toDateString() && (
                            <div className="text-sm text-gray-500 dark:text-neutral-400">
                              to {formatDate(event.endDate)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{event.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeStyles[event.eventType]}`}>
                            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[event.status]}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/events/${event.id}`}>
                              <Button size="small" variant="outline">View</Button>
                            </Link>
                            <Link href={`/events/${event.id}/edit`}>
                              <Button size="small" variant="outline">Edit</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Box>
    </PageLayout>
  );
}
