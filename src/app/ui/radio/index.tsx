import React, { ReactElement, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  label: string;
  error?: string;
}

const Radio: React.FC<Props> = ({
  error,
  label,
  ...restProps
}): ReactElement => (
  <div className="flex items-start">
    <div className="flex h-5 items-center">
      <input
        type="radio"
        className={clsx(
          'h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
          {
            'border-red-600': error,
          }
        )}
        {...restProps}
      />
    </div>
    <div className="ml-3 text-sm">
      <label
        className={clsx('font-medium dark:text-white', {
          'text-red-600': error,
        })}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600" id="radio-error">
          {error}
        </p>
      )}
    </div>
  </div>
);

export default Radio;
