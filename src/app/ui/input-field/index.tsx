import React, { ReactElement, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  title: string;
  error?: string;
}
const InputField: React.FC<Props> = ({
  error,
  title,
  ...restProps
}): ReactElement => (
  <>
    <div className='max-w-sm'>
      <label
        htmlFor='input-label'
        className={clsx(
          'block text-sm font-bold dark:text-white',
          error && 'text-red-600',
        )}
      >
        {title}
      </label>
      <input
        id='input-label'
        className={clsx(
          'block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
          {
            'border-red-600 text-red-600': error,
            'border-gray-200': !error,
          },
        )}
        placeholder='you@site.com'
        {...restProps}
      />
      {error && (
        <p
          className='mt-2 text-sm text-red-600'
          id='hs-validation-name-error-helper'
        >
          {error}
        </p>
      )}
    </div>
  </>
);

export default InputField;
