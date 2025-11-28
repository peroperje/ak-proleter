'use client';
import React, { ReactElement, useMemo, useState } from 'react';
import { EventForm } from '@/app/components/events';
import { createEvent } from '@/app/lib/actions/event';
import { EventActionState, EventFormData } from '@/app/components/events/EventForm';
import { AIPopulationModal, TextAreaDefault as AIDefaultTextAreaPrompt } from '@/app/components/AiFormPopulator';
import { Category } from '@/app/lib/actions';

interface Props {
  categories: Category[];
}
const FormContainer: React.FC<Props> = ({ categories }): ReactElement => {
  const [aiFormData, setAiFormData] = useState<EventFormData | undefined>();
  const [remountKey, setRemountKey] = useState<number>(0);

  const computedInitialState = useMemo<EventActionState>(() => {
    const initialState: EventActionState = {
      message: 'Please fill out the form below to create a new event.',
      errors: {},
      status: 'new' as const,
      data: undefined,
    };
    return aiFormData ? { ...initialState, data: aiFormData } : initialState;
  }, [aiFormData]);

  return (

    <>
      <AIPopulationModal<EventFormData>
        onDataExtracted={(data) => {
          console.log(data);
          // Normalize and map extracted data to EventFormData
          const normalizeType = (t: unknown): EventFormData['type'] => {
            const v = String(t || '').toUpperCase();
            if (['COMPETITION', 'TRAINING', 'CAMP', 'MEETING', 'OTHER'].includes(v)) return v as EventFormData['type'];
            return 'OTHER';
          };

          const mapped: EventFormData = {
            title: data.title ?? '',
            description: data.description ?? undefined,
            location: data.location ?? '',
            startDate: data.startDate ? new Date(data.startDate) : new Date(),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            type: normalizeType(data.type),
            categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : undefined,
          };
          setAiFormData(mapped);
          setRemountKey(Date.now()); // force remount so EventForm picks up new initialState
        }}
        defaultPrompt={`Extract event information from this text and return a pure JSON object with fields: 
            title, 
            description, 
            location, 
            startDate (format YYYY-MM-DDTHH:MM without timezone, e.g. 2025-09-04T18:30), 
            endDate (format YYYY-MM-DDTHH:MM without timezone, optional),
            type (one of COMPETITION, TRAINING, CAMP, MEETING, OTHER). 
            Only include fields clearly present; do not add extra text.`}
        renderTextArea={(textProps) => (
          <AIDefaultTextAreaPrompt
            {...textProps}

            label={'Enter description of event:'}
            placeholder={'Example: Create competition \'Spring Invitational\' at City Stadium, on May 10, 2026 from 10:00 to 15:00, categories U18 and Seniors, type COMPETITION'}
          />
        )}
      />

      <EventForm
        key={remountKey}
        action={createEvent}
        categories={categories}
        initialState={computedInitialState}
      />
    </>

  );
};

export default FormContainer;
