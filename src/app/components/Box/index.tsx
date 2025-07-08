import React, { ReactElement, PropsWithChildren } from 'react';
import { icons, IconType } from '@/app/lib/icons';
import clsx from 'clsx';

interface Props {
  title: string | (() => React.ReactNode);
  icon?: IconType;
  variants?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

const Box: React.FC<PropsWithChildren<Props>> = ({title, icon, children, variants}): ReactElement=> {
  const IconComponent = icon ? icons[icon] : null;
  const titleContent = typeof title === 'function' ? title() : title;

  return (
    <div className='flex flex-col rounded-xl border border-gray-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70'>
      <div
        className={clsx(
          'rounded-t-xl border border-gray-100 bg-gray-100 px-2 py-1 md:px-5 md:py-4 dark:border-neutral-700 dark:bg-neutral-900',
          {
            'border-green-500 bg-green-100 dark:bg-green-400':
              variants === 'success',
          },
        )}
      >
        <div className='flex  items-center'>
          {IconComponent && (
            <IconComponent
              className={clsx('mr-2 text-gray-500 dark:text-neutral-500',{
                'text-red-500 dark:text-red-400': variants === 'error',
              })}
              size={18}
            />
          )}
          <p
            className={clsx(
              'mt-1 w-full text-center text-sm text-gray-500 md:text-left dark:text-neutral-500',
              {
                'text-red-500 dark:text-red-400': variants === 'error',
              },
            )}
          >
            {titleContent}
          </p>
        </div>
      </div>
      <div className='p-4 md:p-5'>{children}</div>
    </div>
  );
}

export default Box;
