import React from 'react';
import { RoundedCloseButton } from './index';

export default {
  title: 'UI/Button/RoundedCloseButton',
  component: RoundedCloseButton,
};

export const Default = () => {
  return (
    <div className="flex items-center justify-center md:h-screen bg-gray-50 dark:bg-neutral-800 p-4">
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
    <div className="flex items-center justify-center md:h-screen bg-gray-50 dark:bg-neutral-800 p-4">
      <RoundedCloseButton onClick={handleClose} />
    </div>
  );
};

// Example of how to use the component in a real application
export const UsageExample = () => {
  return (
    <div className="relative p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md max-w-md mx-auto">
      <div className="absolute top-2 right-2">
        <RoundedCloseButton onClick={() => console.log('Modal closed')} />
      </div>
      <h2 className="text-xl font-bold mb-4">Modal Title</h2>
      <p>This is an example of how to use the RoundedCloseButton in a modal or card component.</p>
    </div>
  );
};
