import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Modal, { ModalSize } from './index';

export default {
  title: 'UI/Modal',
  component: Modal,
  argTypes: {
    title: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl'] as ModalSize[] },
    closeOnBackdrop: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
  },
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="h-96">
      <button
        className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        Open modal
      </button>
      <Modal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        title={args.title ?? 'Terms of Service'}
        footer={args.footer ?? (
          <>
            <button
              onClick={() => setOpen(false)}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              I accept
            </button>
          </>
        )}
      >
        <p className="text-gray-600 dark:text-neutral-300">
          With great power comes great responsibility. This modal follows Flowbite’s modal layout patterns:
          header with title and close button, scrollable body, and action footer.
        </p>
      </Modal>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  size: 'md',
  closeOnBackdrop: true,
  showCloseButton: true,
};

export const Sizes: StoryFn<typeof Modal> = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="space-x-2">
      {(['sm','md','lg','xl','2xl'] as ModalSize[]).map((s) => (
        <button
          key={s}
          onClick={() => setOpen(true)}
          className="mb-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          Open {s}
        </button>
      ))}
      <Modal
        {...args}
        size={args.size ?? 'lg'}
        open={open}
        onClose={() => setOpen(false)}
        title={`Modal size: ${args.size ?? 'lg'}`}
      >
        <p className="text-gray-600 dark:text-neutral-300">Resize using the size control.</p>
      </Modal>
    </div>
  );
};
Sizes.args = {
  size: 'lg',
};

export const LongContent: StoryFn<typeof Modal> = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={() => setOpen(true)}>Open</button>
      <Modal {...args} open={open} onClose={() => setOpen(false)} title="Privacy Policy" size="lg">
        <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-gray-600 dark:text-neutral-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            </p>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export const NoBackdropClose: StoryFn<typeof Modal> = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={() => setOpen(true)}>Open</button>
      <Modal {...args} open={open} onClose={() => setOpen(false)} title="Protected Action" closeOnBackdrop={false}>
        <p className="text-gray-600 dark:text-neutral-300">Backdrop clicks will not close this modal.</p>
      </Modal>
    </div>
  );
};
