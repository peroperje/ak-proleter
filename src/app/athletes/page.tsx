import React from 'react';
import Link from 'next/link';
import Box from '@/app/views/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Athlete } from '@/app/lib/definitions';

// Mock data for demonstration
const mockAthletes: Athlete[] = [
  {
    id: '1',
    firstName: 'Marko',
    lastName: 'Petrović',
    dateOfBirth: new Date('1998-05-15'),
    gender: 'male',
    email: 'marko.petrovic@example.com',
    phone: '+381 63 123 4567',
    joinDate: new Date('2020-01-10'),
    active: true,
    categories: ['Senior', 'Long Distance'],
  },
  {
    id: '2',
    firstName: 'Ana',
    lastName: 'Jovanović',
    dateOfBirth: new Date('2000-08-22'),
    gender: 'female',
    email: 'ana.jovanovic@example.com',
    phone: '+381 64 987 6543',
    joinDate: new Date('2019-03-15'),
    active: true,
    categories: ['U23', 'Sprint'],
  },
  {
    id: '3',
    firstName: 'Nikola',
    lastName: 'Đorđević',
    dateOfBirth: new Date('1995-11-30'),
    gender: 'male',
    email: 'nikola.djordjevic@example.com',
    phone: '+381 65 456 7890',
    joinDate: new Date('2018-06-20'),
    active: false,
    categories: ['Senior', 'Throws'],
  },
];

export default function AthletesPage() {
  const addAthleteButton = (
    <Link href="/athletes/new">
      <Button variant="submit">Add Athlete</Button>
    </Link>
  );

  return (
    <PageLayout
      title="Athletes"
      currentPage="athletes"
      action={addAthleteButton}
    >

          <Box title="Athlete List">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Gender
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
                  {mockAthletes.map((athlete) => {
                    // Calculate age
                    const today = new Date();
                    const birthDate = new Date(athlete.dateOfBirth);
                    const age = today.getFullYear() - birthDate.getFullYear() -
                      (today.getMonth() < birthDate.getMonth() ||
                      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

                    return (
                      <tr key={athlete.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {athlete.firstName} {athlete.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-neutral-400">
                                {athlete.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {athlete.gender === 'male' ? 'Male' : 'Female'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {athlete.categories?.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            athlete.active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {athlete.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/athletes/${athlete.id}`}>
                              <Button size="small" variant="outline">View</Button>
                            </Link>
                            <Link href={`/athletes/${athlete.id}/edit`}>
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
