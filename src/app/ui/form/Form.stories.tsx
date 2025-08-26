import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Form from './index';
import InputField from '../input-field';
import Checkbox from '../checkbox';
import Radio from '../radio';
import Select from '../select';
import Textarea from '../textarea';

export default {
  title: 'UI/Form',
  component: Form,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    submitText: { control: 'text' },
    cancelText: { control: 'text' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
  },
} as Meta<typeof Form>;

const Template: StoryFn<typeof Form> = (args) => <Form {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Profile Information',
  description: 'Update your account profile information.',
  children: (
    <>
      <InputField title='Full Name' placeholder='John Doe' />
      <InputField title='Email' type='email' placeholder='john@example.com' />
    </>
  ),
};

export const WithAllFields = Template.bind({});
WithAllFields.args = {
  title: 'Complete Form',
  description: 'This form demonstrates all available form components.',
  children: (
    <>
      <InputField title='Full Name' placeholder='John Doe' />
      <InputField title='Email' type='email' placeholder='john@example.com' />

      <Select
        label='Country'
        options={[
          { value: '', label: 'Select a country' },
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'uk', label: 'United Kingdom' },
        ]}
      />

      <div className='space-y-2'>
        <p className='block text-sm font-bold dark:text-white'>Gender</p>
        <Radio label='Male' name='gender' />
        <Radio label='Female' name='gender' />
        <Radio label='Other' name='gender' />
      </div>

      <Textarea label='Bio' placeholder='Tell us about yourself...' />

      <Checkbox label='I agree to the terms and conditions' />
    </>
  ),
};

export const WithError = Template.bind({});
WithError.args = {
  title: 'Profile Information',
  description: 'Update your account profile information.',
  error: 'There was an error submitting the form. Please try again.',
  children: (
    <>
      <InputField title='Full Name' placeholder='John Doe' />
      <InputField
        title='Email'
        type='email'
        placeholder='john@example.com'
        error='Invalid email address'
      />
    </>
  ),
};

export const Loading = Template.bind({});
Loading.args = {
  title: 'Profile Information',
  description: 'Update your account profile information.',
  isLoading: true,
  children: (
    <>
      <InputField title='Full Name' placeholder='John Doe' />
      <InputField title='Email' type='email' placeholder='john@example.com' />
    </>
  ),
};

export const WithCancel = Template.bind({});
WithCancel.args = {
  title: 'Profile Information',
  description: 'Update your account profile information.',
  onCancel: () => {},
  children: (
    <>
      <InputField title='Full Name' placeholder='John Doe' />
      <InputField title='Email' type='email' placeholder='john@example.com' />
    </>
  ),
};
