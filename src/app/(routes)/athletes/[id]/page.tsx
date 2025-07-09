import React, { Suspense, use } from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Athlete } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import { navItems } from '@/app/lib/routes/index';
import CloseBtn from '@/app/components/CloseBtn';
import ProfileInfoBoxContent from '@/app/components/athletes/ProfileInfoBoxContent';
import ContactBoxContent from '@/app/components/athletes/ContactBoxContent';

// Function to fetch athlete by ID
async function getAthleteById(id: string): Promise<Athlete | null> {
  // Fetch user with a MEMBER role from the database
  const user = await prisma.user.findUnique({
    where: {
      id: id,
      role: 'MEMBER',
    },
    include: {
      profile: {
        include: {
          category: true,
        },
      },
    },
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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // Fetch athlete data
  const { id } = use(params);
  const athlete = use(getAthleteById(id));

  if (!athlete) {
    return (
      <PageLayout title='Athlete Not Found'>
        <Box icon={navItems.athletes.icon} title='Error' variants='error'>
          <p className='text-red-500'>
            The athlete you are looking for does not exist.
          </p>
          <div className='mt-4'>
            <Link href='/athletes'>
              <Button variant='outline'>Back to Athletes</Button>
            </Link>
          </div>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={''} action={<CloseBtn />}>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Profile Information */}
        <div className='md:col-span-1'>
          <Box icon={'running'} title='Profile Information'>
            <Suspense fallback={<>Loading</>}>
              <ProfileInfoBoxContent {...athlete} />
            </Suspense>
          </Box>
        </div>

        {/* Contacts  */}
        <div className='md:col-span-1'>
          <Box title='Contacts' icon={'mail'}>
            <Suspense fallback={<>loding...</>}>
              <ContactBoxContent {...athlete} />
            </Suspense>
          </Box>
        </div>
      </div>
    </PageLayout>
  );
}
