import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Button from './index';

export default {
  title: 'ui/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['submit', 'cancel', 'outline'],
      description: 'Defines the button style (submit, cancel, or outline).',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Defines the size of the button.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Sets the button to be disabled or not.',
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the button.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback for when the button is clicked.',
    },
  },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'submit',
  size: 'medium',
  children: 'Submit',
};
