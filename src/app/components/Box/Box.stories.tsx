import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Box from './index';

export default {
  title: 'views/Box',
  component: Box,
  argTypes: {
    title: { control: 'text', description: 'The title of the box.' },
    children: {
      control: 'text',
      description: 'Content to display inside the box.',
    },
  },
} as Meta<typeof Box>;

const Template: StoryFn<typeof Box> = (args) => <Box {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Default Title',
  children: 'This is the box content.',
};

export const WithCustomContent = Template.bind({});
WithCustomContent.args = {
  title: 'Custom Title',
  children: (
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  ),
};
