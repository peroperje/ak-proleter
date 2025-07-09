import React, { ReactElement, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Option {
  value: string;
  label: string;
}

interface Props
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  options: Option[];
  error?: string;
}

const Select: React.FC<Props> = ({
  label,
  options,
  error,
  ...restProps
}): ReactElement => (
  <div>
    <label
      htmlFor='select-input'
      className={clsx(
        'block text-sm font-bold dark:text-white',
        error && 'text-red-600',
      )}
    >
      {label}
    </label>
    <select
      id='select-input'
      className={clsx(
        'mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400',
        {
          'border-red-600 text-red-600': error,
          'border-gray-200': !error,
        },
      )}
      {...restProps}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className='mt-2 text-sm text-red-600' id='select-error'>
        {error}
      </p>
    )}
  </div>
);

export default Select;
