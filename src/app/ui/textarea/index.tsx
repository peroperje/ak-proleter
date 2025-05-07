import React, { ReactElement, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string;
  error?: string;
}

const Textarea: React.FC<Props> = ({
  label,
  error,
  ...restProps
}): ReactElement => (
  <div>
    <label
      htmlFor="textarea-input"
      className={clsx('block text-sm font-bold dark:text-white', error && 'text-red-600')}
    >
      {label}
    </label>
    <textarea
      id="textarea-input"
      className={clsx(
        'mt-1 block w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
        {
          'border-red-600 text-red-600': error,
          'border-gray-200': !error,
        }
      )}
      rows={4}
      {...restProps}
    />
    {error && (
      <p className="mt-2 text-sm text-red-600" id="textarea-error">
        {error}
      </p>
    )}
  </div>
);

export default Textarea;
