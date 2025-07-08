import PageLayout from '@/app/components/PageLayout';
import { notFound } from 'next/navigation';
import EditForm from '@/app/events/[id]/edit/EditForm';
import CloseBtn from '@/app/components/CloseBtn';
import { CategoryProvider } from '@/app/components/events';
import prisma from '@/app/lib/prisma';
import { EventFormData } from '@/app/lib/actions/event';

interface Props {
  params: Promise<{ id: string }>;
}

// Function to fetch event by ID
async function getEventById(id: string): Promise<EventFormData | null> {
  // Fetch event from the database by ID
  const dbEvent = await prisma.event.findUnique({
    where: { id },
    include: {
      categories: true,
    }
  });

  if (!dbEvent) {
    return null;
  }

  return {
    title: dbEvent.title,
    description: dbEvent.description || undefined,
    location: dbEvent.location,
    lat: dbEvent.lat || undefined,
    lng: dbEvent.lng || undefined,
    startDate: dbEvent.startDate,
    endDate: dbEvent.endDate || undefined,
    type: dbEvent.type,
    categoryIds: dbEvent.categories.map(cat => cat.id),
  };
}

export default async function EditEventPage(props: Props) {
  const params = await props.params;

  const event = await getEventById(params.id);
  if(!event){
    notFound();
  }

  return (
    <PageLayout title={'Edit Event'} currentPage='edit event'>
      <CloseBtn />
      <CategoryProvider>
        {(categories) => (
          <EditForm event={event} eventId={params.id} categories={categories} />
        )}
      </CategoryProvider>
    </PageLayout>
  );
}
