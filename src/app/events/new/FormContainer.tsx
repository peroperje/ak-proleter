import React, { ReactElement } from 'react';
import { EventForm, CategoryProvider } from '@/app/components/events';
import { createEvent } from '@/app/lib/actions';

const FormContainer: React.FC = (): ReactElement => {
  return (
    <CategoryProvider>
      {(categories) => (
        <EventForm action={createEvent} categories={categories} />
      )}
    </CategoryProvider>
  );
};

export default FormContainer;
