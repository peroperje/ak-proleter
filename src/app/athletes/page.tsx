import React from 'react';
import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { Athlete } from '@/app/lib/definitions';
import { icons } from '@/app/lib/icons';
import prisma from '@/app/lib/prisma';
import { navItems } from '@/app/lib/routes';
import AthletesCard from '@/app/components/athletes/AthletesCard';

const IconComponent = icons.addUser;

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
    photoUrl: user.profile?.avatarUrl || undefined,
  }));
}

export default async function AthletesPage() {
  // Fetch athletes from the database
  const athletes = await getAthletes();

  const addAthleteButton = (
    <Link href="/athletes/new">
      <Button variant="submit">
        <IconComponent size={20}  />
        Add Athlete
      </Button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {athletes.map((athlete) => (
                <AthletesCard key={athlete.id} athlete={athlete} />
              ))}
            </div>
          </Box>
    </PageLayout>
  );
}
