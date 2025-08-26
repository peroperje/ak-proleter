import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Loader from './index';

export default {
  title: 'UI/Loader',
  component: Loader,
  argTypes: {
    message: { control: 'text' },
  },
} as Meta<typeof Loader>;

const Template: StoryFn<typeof Loader> = (args) => (
  <div className="relative h-64 border border-dashed border-gray-300 dark:border-neutral-700 rounded-md overflow-hidden">
    {/* The wrapper ensures the absolutely-positioned Loader is contained within a visible area */}
    <Loader {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};

export const WithMessage = Template.bind({});
WithMessage.args = {
  message: 'Loading athletes...'
};
