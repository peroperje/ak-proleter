import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Select from './index';

export default {
  title: 'UI/Select',
  component: Select,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} as Meta<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => <Select {...args} />;

const defaultOptions = [
  { value: '', label: 'Select an option' },
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Default = Template.bind({});
Default.args = {
  label: 'Select an option',
  options: defaultOptions,
};

export const WithPreselectedValue = Template.bind({});
WithPreselectedValue.args = {
  label: 'Select an option',
  options: defaultOptions,
  value: 'option2',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Select an option',
  options: defaultOptions,
  error: 'Please select an option.',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Select an option',
  options: defaultOptions,
  disabled: true,
};
