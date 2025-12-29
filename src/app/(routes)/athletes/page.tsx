import React, { Suspense, use } from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Athlete } from '@/app/lib/definitions';
import { UserPlusIcon, UsersIcon } from '@/app/ui/icons';
import prisma from '@/app/lib/prisma';
import AthletesCard from '@/app/components/athletes/AthletesCard';
import { getAthletes } from '@/app/lib/actions';

const IconComponent = UserPlusIcon;


export async function generateStaticParams() {
  const athletes = await prisma.athlete.findMany({
    select: { id: true },
  });

  return athletes.map((athlete) => ({
    id: athlete.id,
  }));
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const AthleteList = ({ athletes }: { athletes: Athlete[] }) => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {athletes.map((athlete) => (
        <AthletesCard key={athlete.id} athlete={athlete} />
      ))}
    </div>
  );
};

export default function AthletesPage() {
  // Fetch athletes from the database
  const athletes = use(getAthletes());

  return (
    <PageLayout
      title='Athletes'
      action={
        <Link href='/athletes/new' passHref>
          <Button variant='submit'>
            <IconComponent size={20} />
            Add Athlete
          </Button>
        </Link>
      }
    >
      <Box icon={UsersIcon} title='Athlete List'>
        <Suspense fallback={<>Loading athletes...</>}>
          <AthleteList athletes={athletes} />
        </Suspense>
      </Box>
    </PageLayout>
  );
}
