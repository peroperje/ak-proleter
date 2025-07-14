'use server';
import prisma from '@/app/lib/prisma';
import { Discipline, DisciplineCategory, MeasurementUnit } from '@prisma/client';

export type GetDisciplineReturn = Array<
  Discipline & {
  category: DisciplineCategory | null;
  unit: MeasurementUnit | null;
}
>;

export async function getDiscipline():Promise<GetDisciplineReturn> {
  return await prisma.discipline.findMany({
    include:{
      category:true,
      unit:true,
    }
  });
}
