import { EventActionState, EventFormData, updateEvent } from '@/app/lib/actions/event';
import { EventForm } from '@/app/components/events';

interface Props {
  event: EventFormData;
  eventId: string;
  categories: { id: string; name: string }[];
}

export default function EditForm({ event, eventId, categories }: Props) {
  const initialState: EventActionState = {
    message: `Update ${event.title} information below.`,
    errors: {},
    status: 'new' as const,
    data: event,
  };

  return (
      <EventForm
        action={updateEvent.bind(null, eventId)}
        categories={categories}
        initialState={initialState}
      />
  );
}
