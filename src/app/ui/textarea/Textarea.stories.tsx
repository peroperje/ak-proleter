import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Textarea from './index';

export default {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
    onChange: { action: 'changed' },
  },
} as Meta<typeof Textarea>;

const Template: StoryFn<typeof Textarea> = (args) => <Textarea {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Description',
  placeholder: 'Enter your description here...',
};

export const WithValue = Template.bind({});
WithValue.args = {
  label: 'Description',
  placeholder: 'Enter your description here...',
  value:
    'This is a sample text that demonstrates how the textarea looks with content.',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Description',
  placeholder: 'Enter your description here...',
  error: 'This field is required.',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Description',
  placeholder: 'Enter your description here...',
  disabled: true,
};

export const CustomRows = Template.bind({});
CustomRows.args = {
  label: 'Description',
  placeholder: 'Enter your description here...',
  rows: 8,
};
