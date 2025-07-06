import React from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Athlete } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import { navItems } from '@/app/lib/routes';
import CloseBtn from '@/app/components/CloseBtn';
import ProfilePhotos from '@/app/components/athletes/ProfilePhotos';

// Function to fetch athlete by ID
async function getAthleteById(id: string): Promise<Athlete | null> {
  // Fetch user with a MEMBER role from the database
  const user = await prisma.user.findUnique({
    where: {
      id: id,
      role: 'MEMBER'
    },
    include: {
      profile: {
        include: {
          category: true
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  // Transform the user data to match the Athlete interface
  return {
    id: user.id,
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ').slice(1).join(' '),
    dateOfBirth: user.profile?.dateOfBirth || new Date(),
    gender: user.profile?.gender === 'male' ? 'male' : 'female',
    email: user.email,
    phone: user.profile?.phoneNumber || undefined,
    joinDate: user.createdAt,
    active: true, // This information is not in the schema, defaulting to true
    categories: user.profile?.category ? [user.profile.category.name] : [],
    address: user.profile?.address,
    notes: user.profile?.bio,
    photoUrl: user.profile?.avatarUrl || undefined,
  };
}

// Calculate age from date of birth
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Format date to a readable string
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function Page({ params }: { params: { id: string } }) {
  // Fetch athlete data
  const athlete = await getAthleteById(params.id);

  if (!athlete) {
    return (
      <PageLayout
        title="Athlete Not Found"
        currentPage="athletes"
      >
        <Box
          icon={navItems.athletes.icon}
          title="Error"
          variants="error"
        >
          <p className="text-red-500">The athlete you are looking for does not exist.</p>
          <div className="mt-4">
            <Link href="/athletes">
              <Button variant="outline">Back to Athletes</Button>
            </Link>
          </div>
        </Box>
      </PageLayout>
    );
  }

  // Calculate age
  const age = calculateAge(athlete.dateOfBirth);


  return (
    <PageLayout
      title={''}
      currentPage="athletes"
      action={<CloseBtn />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <Box
            icon={'running'}
            title="Profile Information"
          >
            <div className="flex flex-col md:flex-row items-start  mb-6">
              <div className="mr-4 mb-4 md:mb-0">
                <div className="w-24 h-24 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                  {athlete.photoUrl ? (
                    /*<img
                      src={athlete.photoUrl}
                      alt={`${athlete.firstName} ${athlete.lastName}`}
                      className="w-full h-full object-cover"
                    />*/
                    <ProfilePhotos src={athlete?.photoUrl} alt={`${athlete.firstName} ${athlete.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl text-gray-400">
                      {athlete.firstName.charAt(0)}{athlete.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    athlete.active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {athlete.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className={'flex flex-col  flex-auto gap-3'}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {athlete.firstName} {athlete.lastName}
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className={'flex flex-col flex-auto gap-0'}>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Age</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{age} years</p>
                  </div>
                  <div className={'flex flex-col flex-auto gap-0'}>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Gender</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {athlete.gender === 'male' ? 'Male' : 'Female'}
                    </p>
                  </div>
                  <div className={'flex flex-col flex-auto gap-0'}>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Date of Birth</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(athlete.dateOfBirth)}</p>
                  </div>



                  <div className={'flex flex-col flex-auto gap-0'}>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Categories</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {athlete.categories && athlete.categories.length > 0
                        ? athlete.categories.join(', ')
                        : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </Box>
        </div>

        {/* Contacts  */}
        <div className="md:col-span-1">
          <Box
            title="Contacts"
            icon={'mail'}
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">




              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Phone</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{athlete.phone || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Email</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{athlete.email || 'Not provided'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Address</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{athlete.address || 'Not provided'}</p>
              </div>
            </div>
          </Box>
        </div>
      </div>

    </PageLayout>
  );
}
