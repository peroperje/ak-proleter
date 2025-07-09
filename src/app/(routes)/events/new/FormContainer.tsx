import React, { ReactElement } from 'react';
import { EventForm, CategoryProvider } from '@/app/components/events';
import { createEvent } from '@/app/lib/actions/event';
import { EventActionState } from '@/app/components/events/EventForm';

const FormContainer: React.FC = (): ReactElement => {
  const initialState: EventActionState = {
    message: 'Please fill out the form below to create a new event.',
    errors: {},
    status: 'new' as const,
    data: undefined,
  };
  return (
    <CategoryProvider>
      {(categories) => (
        <EventForm
          action={createEvent}
          categories={categories}
          initialState={initialState}
        />
      )}
    </CategoryProvider>
  );
};

export default FormContainer;
