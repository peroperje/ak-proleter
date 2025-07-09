import React from 'react';
import { RoundedCloseButton } from './index';

const meta = {
  title: 'UI/Button/RoundedCloseButton',
  component: RoundedCloseButton,
};

export default meta;

export const Default = () => {
  return (
    <div className='flex items-center justify-center bg-gray-50 p-4 md:h-screen dark:bg-neutral-800'>
      <RoundedCloseButton onClick={() => alert('Close button clicked')} />
    </div>
  );
};

export const WithCustomHandler = () => {
  const handleClose = () => {
    console.log('Close button clicked');
    // Add your custom logic here
  };

  return (
    <div className='flex items-center justify-center bg-gray-50 p-4 md:h-screen dark:bg-neutral-800'>
      <RoundedCloseButton onClick={handleClose} />
    </div>
  );
};

// Example of how to use the component in a real application
export const UsageExample = () => {
  return (
    <div className='relative mx-auto max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-neutral-900'>
      <div className='absolute top-2 right-2'>
        <RoundedCloseButton onClick={() => console.log('Modal closed')} />
      </div>
      <h2 className='mb-4 text-xl font-bold'>Modal Title</h2>
      <p>
        This is an example of how to use the RoundedCloseButton in a modal or
        card component.
      </p>
    </div>
  );
};
