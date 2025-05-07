import React from 'react';
import Link from 'next/link';
import Box from '@/app/views/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Result, Athlete, Event, Discipline } from '@/app/lib/definitions';

// Mock data for demonstration
const mockResults: (Result & {
  athlete: Pick<Athlete, 'id' | 'firstName' | 'lastName'>,
  event: Pick<Event, 'id' | 'name'>,
  discipline: Pick<Discipline, 'id' | 'name' | 'measurementUnit'>
})[] = [
  {
    id: '1',
    athleteId: '1',
    eventId: '1',
    disciplineId: '101',
    date: new Date('2023-06-15'),
    value: 10.85, // 10.85 seconds
    position: 1,
    personalBest: true,
    seasonBest: true,
    verified: true,
    verifiedBy: 'Coach Marković',
    // Joined data
    athlete: { id: '1', firstName: 'Marko', lastName: 'Petrović' },
    event: { id: '1', name: 'National Championship 2023' },
    discipline: { id: '101', name: '100m Sprint', measurementUnit: 'time' }
  },
  {
    id: '2',
    athleteId: '2',
    eventId: '1',
    disciplineId: '104',
    date: new Date('2023-06-15'),
    value: 11.92, // 11.92 seconds
    position: 2,
    personalBest: true,
    seasonBest: true,
    verified: true,
    verifiedBy: 'Coach Jovanović',
    // Joined data
    athlete: { id: '2', firstName: 'Ana', lastName: 'Jovanović' },
    event: { id: '1', name: 'National Championship 2023' },
    discipline: { id: '104', name: '100m Sprint', measurementUnit: 'time' }
  },
  {
    id: '3',
    athleteId: '3',
    eventId: '1',
    disciplineId: '103',
    date: new Date('2023-06-16'),
    value: 7.45, // 7.45 meters
    position: 3,
    personalBest: false,
    seasonBest: true,
    verified: true,
    verifiedBy: 'Coach Marković',
    // Joined data
    athlete: { id: '3', firstName: 'Nikola', lastName: 'Đorđević' },
    event: { id: '1', name: 'National Championship 2023' },
    discipline: { id: '103', name: 'Long Jump', measurementUnit: 'distance' }
  },
  {
    id: '4',
    athleteId: '1',
    eventId: '3',
    disciplineId: '301',
    date: new Date('2023-09-05'),
    value: 48.32, // 48.32 seconds
    position: 2,
    personalBest: false,
    seasonBest: false,
    verified: true,
    verifiedBy: 'Coach Marković',
    // Joined data
    athlete: { id: '1', firstName: 'Marko', lastName: 'Petrović' },
    event: { id: '3', name: 'Regional Competition 2023' },
    discipline: { id: '301', name: '400m', measurementUnit: 'time' }
  },
  {
    id: '5',
    athleteId: '2',
    eventId: '3',
    disciplineId: '305',
    date: new Date('2023-09-06'),
    value: 125.45, // 2:05.45 (125.45 seconds)
    position: 1,
    personalBest: true,
    seasonBest: true,
    verified: true,
    verifiedBy: 'Coach Jovanović',
    // Joined data
    athlete: { id: '2', firstName: 'Ana', lastName: 'Jovanović' },
    event: { id: '3', name: 'Regional Competition 2023' },
    discipline: { id: '305', name: '800m', measurementUnit: 'time' }
  }
];

// Helper function to format result value based on measurement unit
function formatResultValue(value: number, unit: string): string {
  if (unit === 'time') {
    // Format time (seconds) to mm:ss.ms format for longer events
    if (value >= 60) {
      const minutes = Math.floor(value / 60);
      const seconds = (value % 60).toFixed(2);
      return `${minutes}:${seconds.padStart(5, '0')}`;
    }
    // Format time (seconds) to ss.ms format for sprint events
    return value.toFixed(2);
  } else if (unit === 'distance') {
    // Format distance (meters) to m.cm format
    return `${value.toFixed(2)}m`;
  } else if (unit === 'points') {
    // Format points as integer
    return Math.round(value).toString();
  }
  return value.toString();
}

// Helper function to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ResultsPage() {
  const addResultButton = (
    <Link href="/results/new">
      <Button variant="submit">Add Result</Button>
    </Link>
  );

  return (
    <PageLayout
      title="Results"
      currentPage="results"
      action={addResultButton}
    >

          <Box title="Result List">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Athlete
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Discipline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Result
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Records
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-900 dark:divide-neutral-700">
                  {mockResults.map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.athlete.firstName} {result.athlete.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {result.event.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {result.discipline.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatResultValue(result.value, result.discipline.measurementUnit)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {result.position ? `${result.position}${getOrdinalSuffix(result.position)}` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(result.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {result.personalBest && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              PB
                            </span>
                          )}
                          {result.seasonBest && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              SB
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link href={`/results/${result.id}`}>
                            <Button size="small" variant="outline">View</Button>
                          </Link>
                          <Link href={`/results/${result.id}/edit`}>
                            <Button size="small" variant="outline">Edit</Button>
                          </Link>
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

// Helper function to get ordinal suffix for position
function getOrdinalSuffix(position: number): string {
  const j = position % 10;
  const k = position % 100;

  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}
