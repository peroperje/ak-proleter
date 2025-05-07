import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Radio from './index';

export default {
  title: 'UI/Radio',
  component: Radio,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    name: { control: 'text' },
    onChange: { action: 'changed' },
  },
} as Meta<typeof Radio>;

const Template: StoryFn<typeof Radio> = (args) => <Radio {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Option 1',
  name: 'radio-group',
};

export const Checked = Template.bind({});
Checked.args = {
  label: 'Option 1',
  name: 'radio-group',
  checked: true,
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Option 1',
  name: 'radio-group',
  error: 'Please select an option.',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Option 1',
  name: 'radio-group',
  disabled: true,
};

// Example of a radio group
export const RadioGroup = () => (
  <div className="space-y-2">
    <Radio label="Option 1" name="radio-group-example" defaultChecked />
    <Radio label="Option 2" name="radio-group-example" />
    <Radio label="Option 3" name="radio-group-example" />
  </div>
);
