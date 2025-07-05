import React from 'react';
import Link from 'next/link';
import Box from '@/app/views/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Athlete } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import { navItems } from '@/app/lib/routes';

async function getAthletes(): Promise<Athlete[]> {
  // Fetch users with a MEMBER role from the database
  const users = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    include: {
      profile: {
        include: {
          category: true
        }
      }
    }
  });

  // Transform the user data to match the Athlete interface
  return users.map(user => ({
    id: user.id,
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ').slice(1).join(' '),
    dateOfBirth: user.profile?.dateOfBirth || new Date(),
    gender: user.profile?.gender === 'male'?'male':'female', // This information is not in the schema, defaulting to male
    email: user.email,
    phone: user.profile?.phoneNumber || undefined,
    joinDate: user.createdAt,
    active: true, // This information is not in the schema, defaulting to true
    categories: user.profile?.category ? [user.profile.category.name] : [],
    address: user.profile?.address,
    notes: user.profile?.bio,
  }));
}

export default async function AthletesPage() {
  // Fetch athletes from the database
  const athletes = await getAthletes();

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

          <Box
          icon={navItems.athletes.icon}
            title="Athlete List"
          >
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
                  {athletes.map((athlete) => {
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
