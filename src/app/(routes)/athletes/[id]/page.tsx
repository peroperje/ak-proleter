import React, { Suspense, use } from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Athlete } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import CloseBtn from '@/app/components/CloseBtn';
import ProfileInfoBoxContent from '@/app/components/athletes/ProfileInfoBoxContent';
import ContactBoxContent from '@/app/components/athletes/ContactBoxContent';
import { UsersIcon, RunningIcon, MailIcon } from '@/app/ui/icons';

// Function to fetch athlete by ID
async function getAthleteById(id: string): Promise<Athlete | null> {

  const athlete = await prisma.athlete.findUnique({
    where: {
      id: id
    },
    include: {
      user: true,
      category: true
    }
  });

  if (!athlete) {
    return null;
  }

  // Transform the user data to match the Athlete interface
  /*return {
    id: user.id,
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ').slice(1).join(' '),
    dateOfBirth: user.athlete?.dateOfBirth || new Date(),
    gender: user.athlete?.gender === 'male' ? 'male' : 'female',
    email: user.email,
    phone: user.athlete?.phoneNumber || undefined,
    joinDate: user.createdAt,
    active: true, // This information is not in the schema, defaulting to true
    categories: user.athlete?.category ? [user.athlete.category.name] : [],
    address: user.athlete?.address,
    notes: user.athlete?.bio,
    photoUrl: user.athlete?.avatarUrl || undefined,
  };*/
  return {
    id: athlete.id,
    firstName: athlete.name.split(' ')[0],
    lastName: athlete.name.split(' ').slice(1).join(' '),
    dateOfBirth: athlete?.dateOfBirth || new Date(),
    gender: athlete?.gender === 'male' ? 'male' : 'female',
    email: athlete?.user?.email || '',
    phone: athlete?.phoneNumber || undefined,
    joinDate: athlete?.user?.createdAt,
    active: true, // This information is not in the schema, defaulting to true
    categories: athlete?.category ? [athlete.category.name] : [],
    address: athlete?.address,
    notes: athlete?.bio,
    photoUrl: athlete?.avatarUrl || undefined
  }
}



export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // Fetch athlete data
  const { id } = use(params);
  const athlete = use(getAthleteById(id));

  if (!athlete) {
    return (
      <PageLayout title="Athlete Not Found">
        <Box icon={UsersIcon} title="Error" variants="error">
          <p className="text-red-500">
            The athlete you are looking for does not exist.
          </p>
          <div className="mt-4">
            <Link href="/athletes">
              <Button variant="outline">Back to Athletes</Button>
            </Link>
          </div>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={''} action={<CloseBtn />}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <Box icon={RunningIcon} title="Profile Information">
            <Suspense fallback={<>Loading</>}>
              <ProfileInfoBoxContent {...athlete} />
            </Suspense>
          </Box>
        </div>

        {/* Contacts  */}
        <div className="md:col-span-1">
          <Box title="Contacts" icon={MailIcon}>
            <Suspense fallback={<>loding...</>}>
              <ContactBoxContent {...athlete} />
            </Suspense>
          </Box>
        </div>
      </div>
    </PageLayout>
  );
}
