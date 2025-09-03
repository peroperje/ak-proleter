'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import Modal from '@/app/ui/modal';
import { HiSparklesIcon } from '@/app/ui/icons';
import Button from '@/app/ui/button';
import {
  AiFormPopulatorProps,
  AiFormPopulator,
  TextAreaDefault as AIDefaultTextAreaPrompt,
} from '@/app/components/AiFormPopulator';
import clsx from 'clsx';

const AIPopulationModal: React.FC<AiFormPopulatorProps> = ({
  onDataExtracted,
}): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiPopulationState, setAiPopulationState] = useState<
    'new' | 'success-populated'
  >('new');

  useEffect(() => {
    if (aiPopulationState === 'success-populated') {
      const timeout = setTimeout(() => {
        setAiPopulationState('new');
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [aiPopulationState, setAiPopulationState]);

  return (
    <>
      <div
        className={clsx('flex items-center justify-between p-4', {
          'rounded-lg border border-green-500 bg-green-100 dark:bg-green-400':
            aiPopulationState === 'success-populated',
        })}
      >
        <h3
          className={'text-sm text-gray-500 md:text-left dark:text-neutral-500'}
        >
          {aiPopulationState === 'success-populated' &&
            'The form has been populated with AI help! Please check the form and submit it.'}
        </h3>
        <Button
          variant={'outline'}
          size={'small'}
          type={'button'}
          onClick={() => setIsExpanded(true)}
        >
          <HiSparklesIcon size={25} />
          AI Populate Form
        </Button>
      </div>
      <Modal
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        title={'AI Form Populator'}
      >
        <AiFormPopulator
          defaultPrompt={
            'Extract athlete information from this text and return as JSON with these fields: firstName, lastName, dateOfBirth (YYYY-MM-DD format), gender (male/female), phone, address, notes. Only include fields clearly mentioned.'
          }
          renderTextArea={(textProps) => {
            return (
              <AIDefaultTextAreaPrompt
                {...textProps}
                label={'Enter description of athlete:'}
                placeholder='Example: Create athlete Maria Rodriguez, female, born March 15 1992, phone 555-0123, lives at 456 Oak Street, New York'
              />
            );
          }}
          onDataExtracted={(data) => {
            setAiPopulationState('success-populated');
            setIsExpanded(false);
            onDataExtracted(data);
          }}
        />
      </Modal>
    </>
  );
};

export default AIPopulationModal;
