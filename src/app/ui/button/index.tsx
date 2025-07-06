import React, { ReactElement, ButtonHTMLAttributes } from 'react';
import RoundedCloseButton from './RoundedCloseButton';

interface Props
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'submit' | 'cancel' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const variants = {
  submit:
    'border-transparent bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:bg-teal-600',
  cancel:
    'border-transparent bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600',
  outline:
    'border-blue-500 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:border-blue-500 focus:text-blue-500 dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400',
};
const sizes = {
  small: 'text-xs px-2.5 py-1.5',
  medium: 'text-sm px-4 py-2',
  large: 'text-base px-6 py-3',
};
const Button: React.FC<Props> = ({
  variant = 'submit',
  size = 'medium',
  disabled,
  ...restProps
}): ReactElement => {
  return (
    <button
      disabled={disabled}
      {...restProps}
      className={`${sizes[size]} ${variants[variant]} justify-center inline-flex items-center gap-x-2 rounded-lg border font-bold disabled:pointer-events-none disabled:opacity-50`}
    />
  );
};

export { RoundedCloseButton };
export default Button;
