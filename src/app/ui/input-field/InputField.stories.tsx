import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import InputField from './index';

export default {
  title: 'UI/InputField',
  component: InputField,
  argTypes: {
    title: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} as Meta<typeof InputField>;

const Template: StoryFn<typeof InputField> = (args) => <InputField {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Email',
  placeholder: 'you@site.com',
};

export const WithError = Template.bind({});
WithError.args = {
  title: 'Email',
  error: 'This field is required.',
  placeholder: 'you@site.com',
};

export const Disabled = Template.bind({});
Disabled.args = {
  title: 'Email',
  placeholder: 'you@site.com',
  disabled: true,
};
