import React from 'react';
import Link from 'next/link';
import Box from '@/app/views/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Result, Athlete, Event, Discipline } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';

type ResultWithRelations = Result & {
  athlete: Pick<Athlete, 'id' | 'firstName' | 'lastName'>,
  event: Pick<Event, 'id' | 'name'>,
  discipline: Pick<Discipline, 'id' | 'name' | 'measurementUnit'>
};

async function getResults(): Promise<ResultWithRelations[]> {
  // Fetch results from the database
  const dbResults = await prisma.result.findMany({
    include: {
      user: true,
      event: true,
    }
  });

  // Transform the database results to match the Result interface
  return dbResults.map(result => {
    // Parse the score to a number if possible
    let value = 0;
    if (result.score) {
      // Try to parse as a number (e.g., "10.85" -> 10.85)
      const parsedValue = parseFloat(result.score);
      if (!isNaN(parsedValue)) {
        value = parsedValue;
      } else if (result.score.includes(':')) {
        // Handle time format like "2:05.45"
        const [minutes, seconds] = result.score.split(':');
        value = parseFloat(minutes) * 60 + parseFloat(seconds);
      }
    }

    // Create a mock discipline since we don't have disciplines in the database
    const mockDiscipline: Pick<Discipline, 'id' | 'name' | 'measurementUnit'> = {
      id: `d-${result.id}`,
      name: result.event.title.includes('Sprint') ? 'Sprint' : 'General',
      measurementUnit: result.score?.includes('m') ? 'distance' : 'time',
    };

    // Split user name into first and last name
    const nameParts = result.user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return {
      id: result.id,
      athleteId: result.userId,
      eventId: result.eventId,
      disciplineId: mockDiscipline.id,
      date: result.createdAt,
      value,
      position: result.position || undefined,
      personalBest: result.notes?.includes('Personal best') || false,
      seasonBest: result.notes?.includes('Season best') || false,
      verified: true,
      verifiedBy: 'Coach',
      notes: result?.notes || undefined,
      // Joined data
      athlete: {
        id: result.userId,
        firstName,
        lastName
      },
      event: {
        id: result.eventId,
        name: result.event.title
      },
      discipline: mockDiscipline
    };
  });
}

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

export default async function ResultsPage() {
  // Fetch results from the database
  const results = await getResults();

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
                  {results.map((result) => (
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
