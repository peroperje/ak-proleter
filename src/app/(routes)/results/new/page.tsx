import React, { ReactElement } from 'react';
import { Metadata } from 'next';
import prisma from '@/app/lib/prisma';
import ResultForm from './ResultForm';

export const metadata: Metadata = {
  title: 'Create Result',
};

const Page = async (): Promise<ReactElement> => {
  const athletes = await prisma.athlete.findMany();
  const events = await prisma.event.findMany();
  const disciplines = await prisma.discipline.findMany();

  return <ResultForm athletes={athletes} events={events} disciplines={disciplines} />;
};

export default Page;
