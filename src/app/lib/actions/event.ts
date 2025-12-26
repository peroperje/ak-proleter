'use server';
import { Event as PrismaEvent } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import * as yup from 'yup';
import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';

import { Event } from '@/app/lib/definitions';
import { getEventStatus } from '@/app/lib/utils/event';

// Define the type for the form data
export interface EventFormData {
  title: string;
  description?: string;
  location: string;
  lat?: number;
  lng?: number;
  startDate: Date;
  endDate?: Date;
  type: 'COMPETITION' | 'TRAINING' | 'CAMP' | 'MEETING' | 'OTHER';
  categoryIds?: string[];
}

// Define the type for the action state
export type EventActionState = {
  errors: {
    [K in keyof EventFormData]?: string;
  };
  message: string;
  data?: EventFormData;
  status: 'success' | 'error' | 'validation' | 'new';
};

// Define validation schema using yup
const eventSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters long'),
  description: yup.string().optional(),
  location: yup.string().required('Location is required'),
  lat: yup.number().optional(),
  lng: yup.number().optional(),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().optional(),
  type: yup
    .string()
    .oneOf(
      ['COMPETITION', 'TRAINING', 'CAMP', 'MEETING', 'OTHER'],
      'Invalid event type',
    )
    .required('Event type is required'),
  categoryIds: yup.array().of(yup.string()).optional(),
});

// Function to convert FormData to EventFormData
function getEventObjectFromFormData(payload: FormData): EventFormData {
  const title = payload.get('title') as string;
  const description = (payload.get('description') as string) || undefined;
  const location = payload.get('location') as string;
  const latStr = payload.get('lat') as string;
  const lngStr = payload.get('lng') as string;
  const startDate = payload.get('startDate') as string;
  const endDate = (payload.get('endDate') as string) || undefined;
  const type = payload.get('type') as
    | 'COMPETITION'
    | 'TRAINING'
    | 'CAMP'
    | 'MEETING'
    | 'OTHER';

  // Get all selected categories
  const categoryIds = payload
    .getAll('categoryIds')
    .map((value) => value as string);

  // Convert lat and lng to numbers if they exist
  const lat = latStr ? parseFloat(latStr) : undefined;
  const lng = lngStr ? parseFloat(lngStr) : undefined;

  return {
    title,
    description,
    location,
    lat,
    lng,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : undefined,
    type,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
  };
}

export async function createEvent(_state: EventActionState, payload: FormData) {
  // Prepare data for submission
  const formattedData = getEventObjectFromFormData(payload);

  try {
    await eventSchema.validate(formattedData, { abortEarly: false });
    // TODO: this is hardocded. need to be current user
    const organizer = await prisma.user.findFirst();

    // Create a new event
    await prisma.event.create({
      data: {
        title: formattedData.title,
        description: formattedData.description,
        location: formattedData.location,
        lat: formattedData.lat,
        lng: formattedData.lng,
        startDate: formattedData.startDate,
        endDate: formattedData.endDate,
        type: formattedData.type,
        organizerId: organizer?.id || '',
        // Connect categories only if provided
        categories: {
          connect: formattedData.categoryIds && formattedData.categoryIds.length > 0
            ? formattedData.categoryIds.map((id) => ({ id }))
            : [],
        },
      },
    });

    revalidatePath('/events');
    revalidatePath('/events/new');

    return {
      errors: {} as EventActionState['errors'],
      message: 'Event created successfully',
      status: 'success' as const,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        errors: error.inner.reduce(
          (acc, err) => {
            if (err.path) {
              acc[err.path as keyof EventActionState['errors']] = err.message;
            }
            return acc;
          },
          {} as EventActionState['errors'],
        ),
        message: 'Please correct the errors below',
        data: formattedData,
        status: 'error' as const,
      };
    }
    console.log('Error creating event:', error);
    return {
      errors: {} as EventActionState['errors'],
      message: 'An unexpected error occurred. Please, check your data',
      data: formattedData,
      status: 'error' as const,
    };
  }
}

export async function updateEvent(
  id: string,
  _state: EventActionState,
  payload: FormData,
) {
  // Prepare data for submission
  const formattedData = getEventObjectFromFormData(payload);

  try {
    await eventSchema.validate(formattedData, { abortEarly: false });
    // Update the existing event
    await prisma.event.update({
      where: { id },
      data: {
        title: formattedData.title,
        description: formattedData.description,
        location: formattedData.location,
        lat: formattedData.lat,
        lng: formattedData.lng,
        startDate: formattedData.startDate,
        endDate: formattedData.endDate,
        type: formattedData.type,
        // Update categories
        categories: {
          set: formattedData.categoryIds && formattedData.categoryIds.length > 0
            ? formattedData.categoryIds.map((id) => ({ id }))
            : [],
        },
      },
    });

    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    revalidatePath(`/events/${id}/edit`);

    return {
      errors: {} as EventActionState['errors'],
      message: 'Event updated successfully',
      status: 'success' as const,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        errors: error.inner.reduce(
          (acc, err) => {
            if (err.path) {
              acc[err.path as keyof EventActionState['errors']] = err.message;
            }
            return acc;
          },
          {} as EventActionState['errors'],
        ),
        message: 'Please correct the errors below',
        data: formattedData,
        status: 'error' as const,
      };
    }

    return {
      errors: {} as EventActionState['errors'],
      message: 'An unexpected error occurred. Please, check your data',
      data: formattedData,
      status: 'error' as const,
    };
  }
}

export async function getEventById(
  id: string,
  options: {
    select?: Prisma.EventSelect | null | undefined;
    omit?: Prisma.EventOmit | null | undefined;
    include?: Prisma.EventInclude | null | undefined;
  },
) {
  return await prisma.event.findUnique({
    ...options,
    ...{
      where: { id },
    },
  });
}



const mapDBEvents = (event: PrismaEvent & {
  categories?: { id: string; name: string; description: string; minAge: number; maxAge: number | null; }[];
  organizer?: { name: string; };
}
) => {
  const status = getEventStatus(event.startDate, event.endDate);

  return {
    id: event.id,
    name: event.title,
    description: event.description || '',
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    type: event.type,
    category:
      event.categories && event.categories.length > 0 ? event.categories : null,
    status,
    organizer: event.organizer?.name || 'Unknown',
    notes: '',
  };
};

export async function getEvents(): Promise<Event[]> {
  // Fetch events from the database
  const dbEvents = await prisma.event.findMany({
    include: {
      organizer: true,
      categories: true,
    },
  });

  return dbEvents.map((event) => {
    return mapDBEvents(event);
  });
}
export async function getClosedEvents(): Promise<Event[]> {
  const today = new Date();
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
  const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  const dbEvents = await prisma.event.findMany({
    where: {
      OR: [
        // Currently ongoing events
        {
          AND: [{ startDate: { lte: today } }, { endDate: { gte: today } }],
        },
        // Events starting or ending within 3 days range
        {
          OR: [
            { startDate: { gte: threeDaysAgo, lte: threeDaysFromNow } },
            { endDate: { gte: threeDaysAgo, lte: threeDaysFromNow } },
          ],
        },
      ],
    },
    orderBy: {
      startDate: 'asc',
    },
  });
  return dbEvents.map((event) => {
    return mapDBEvents(event);
  });
}
