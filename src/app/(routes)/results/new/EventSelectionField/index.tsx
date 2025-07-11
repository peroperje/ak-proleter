import React from 'react';
import { getClosedEvents } from '@/app/lib/actions';
import SelectionBox from '@/app/(routes)/results/new/EventSelectionField/SelectionBox';

const EventSelectionField: React.FC = async ()=> {
  const events = await getClosedEvents();
  return (
    <>
      <SelectionBox events={events} />
    </>
  );
}

export default EventSelectionField;
