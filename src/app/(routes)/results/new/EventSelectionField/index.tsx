import React, { Suspense } from 'react';
import { getClosedEvents } from '@/app/lib/actions';
import { type Event } from '@/app/lib/definitions';


interface Props {
  children: (events: Event[]) => React.ReactNode;
}
const EventSelectionField: React.FC<Props> = async ({children})=> {
  const events = await getClosedEvents();
  return (
    <Suspense fallback={'loading events'}>
      {children(events)}
    </Suspense>
  );
}

export default EventSelectionField;
