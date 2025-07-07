import React from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Event } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';

async function getEvents(): Promise<Event[]> {
  // Fetch events from the database
  const dbEvents = await prisma.event.findMany({
    include: {
      organizer: true,
      categories: true,
    }
  });

  return dbEvents.map(event => {
    // Determine event status based on dates
    let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';
    const now = new Date();

    if (event.endDate && event.endDate < now) {
      status = 'completed';
    } else if (event.startDate > now) {
      status = 'upcoming';
    } else {
      status = 'ongoing';
    }

    // Map event type from database enum to interface enum
    let eventType: 'competition' | 'training' | 'camp' | 'other';
    switch (event.type) {
      case 'COMPETITION':
        eventType = 'competition';
        break;
      case 'TRAINING':
        eventType = 'training';
        break;
      case 'MEETING':
        eventType = 'camp'; // Map MEETING to camp for interface compatibility
        break;
      default:
        eventType = 'other';
    }

    return {
      id: event.id,
      name: event.title,
      description: event.description || '',
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate || event.startDate,
      eventType,
      category: event.categories && event.categories.length > 0 ? event.categories : null,
      status,
      organizer: event.organizer?.name || 'Unknown',
      notes: ''
    };
  });
}

// Helper function to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function EventsPage() {
  // Fetch events from the database
  const events = await getEvents();

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
                  {events.map((event) => {
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
                          <div className="text-sm text-gray-900 dark:text-white max-w-[200px] truncate" title={event.location}>{event.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeStyles[event.eventType]}`}>
                            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {event.category && event.category.length > 0
                              ? event.category.map(cat => cat.name).join(', ')
                              : 'All categories'}
                          </div>
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
