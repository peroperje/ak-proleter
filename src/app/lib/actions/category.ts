'use server';

import prisma from '@/app/lib/prisma';

/**
 * Fetches all categories from the database
 *
 * @returns An array of category objects with id and name
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
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

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}
