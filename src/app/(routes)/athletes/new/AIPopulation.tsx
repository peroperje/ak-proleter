'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import Modal from '@/app/ui/modal';
import { HiSparklesIcon } from '@/app/ui/icons';
import Button from '@/app/ui/button';
import AiFormPopulator, {
  SmartFormInputProps,
} from '@/app/(routes)/athletes/new/AiFormPopulator';
import clsx from 'clsx';

const AIPopulation: React.FC<SmartFormInputProps> = ({
  onDataExtracted,
}): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiPopulationState, setAiPopulationState] = useState<'new' | 'success-populated'>('new');

  useEffect(() => {
    if(aiPopulationState === 'success-populated'){
      const timeout = setTimeout(() => {
        setAiPopulationState('new');
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [aiPopulationState,setAiPopulationState])

  return (
    <>
      <div
        className={
          clsx('p-4 flex items-center justify-between ', {
            'rounded-lg border border-green-500 bg-green-100 dark:bg-green-400': aiPopulationState === 'success-populated'
          })
        }
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

export default AIPopulation;
