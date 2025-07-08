import PageLayout from '@/app/components/PageLayout';
import { notFound } from 'next/navigation';
import EditForm from '@/app/events/[id]/edit/EditForm';
import CloseBtn from '@/app/components/CloseBtn';
import { CategoryProvider } from '@/app/components/events';
import { EventFormData, getEventById } from '@/app/lib/actions/event';
import { Category } from '@/app/lib/actions';

interface Props {
  params: Promise<{ id: string }>;
}

// Define a type for the database event with included relations
type DbEventWithCategories = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  location: string;
  startDate: Date;
  endDate: Date | null;
  type: 'COMPETITION' | 'TRAINING' | 'CAMP' | 'MEETING' | 'OTHER';
  organizerId: string;
  lat: number | null;
  lng: number | null;
  categories: {
    id: string;
    name: string;
    description: string;
    minAge: number;
    maxAge: number | null;
  }[];
};

// Function to fetch event by ID
async function fetchEventById(id: string): Promise<EventFormData | null> {
  // Fetch event from the database by ID
  const dbEvent = await getEventById(id,{
    include: {
      categories: true,
    }
  }) as DbEventWithCategories | null;

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
    categoryIds: dbEvent.categories.map((cat: Category) => cat.id),
  };
}

export default async function EditEventPage(props: Props) {
  const params = await props.params;

  const event = await fetchEventById(params.id);
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
