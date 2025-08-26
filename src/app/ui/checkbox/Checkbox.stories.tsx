import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Checkbox from './index';

export default {
  title: 'UI/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Accept terms and conditions',
};

export const Checked = Template.bind({});
Checked.args = {
  label: 'Accept terms and conditions',
  checked: true,
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Accept terms and conditions',
  error: 'This field is required.',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Accept terms and conditions',
  disabled: true,
};
