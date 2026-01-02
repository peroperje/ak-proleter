'use server';

import prisma from '@/app/lib/prisma';

/**
 * Type definition for Category
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  minAge: number | null;
  maxAge?: number | null;
}

/**
 * Fetches all categories from the database
 *
 * @returns An array of category objects with id and name
 */
export async function getCategories(): Promise<Category[]> {
  try {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        minAge: true,
        maxAge: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Skipping category fetch during build phase');
      return [];
    }
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}
