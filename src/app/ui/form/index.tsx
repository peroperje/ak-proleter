import React, { ReactElement, FormHTMLAttributes, ReactNode } from 'react';
import Button from '../button';

interface Props extends Omit<FormHTMLAttributes<HTMLFormElement>, 'className'> {
  children: ReactNode;
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

const Form: React.FC<Props> = ({
  children,
  title,
  description,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  isLoading = false,
  error,
  ...restProps
}): ReactElement => (
  <form className='space-y-6' {...restProps}>
    {title && (
      <div>
        <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>
          {title}
        </h3>
        {description && (
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {description}
          </p>
        )}
      </div>
    )}

    <div className='space-y-4'>{children}</div>

    {error && (
      <div className='rounded-md bg-red-50 p-4 dark:bg-red-900/20'>
        <div className='flex'>
          <div className='text-sm text-red-700 dark:text-red-400'>{error}</div>
        </div>
      </div>
    )}

    <div className='flex justify-end gap-3'>
      {onCancel && (
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
      )}
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Loading...' : submitText}
      </Button>
    </div>
  </form>
);

export default Form;
