import React, { ReactElement, PropsWithChildren } from 'react';
import { icons, IconType } from '@/app/lib/icons';

interface Props {
  title: string;
  icon?: IconType;
}

const Box: React.FC<PropsWithChildren<Props>> = ({title, icon, children}): ReactElement=> {
  const IconComponent = icon ? icons[icon] : null;

  return (
    <div className="flex flex-col bg-white border border-gray-200 shadow-xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <div className="bg-gray-100 border border-gray-100 rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex items-center">
          {IconComponent && <IconComponent className="mr-2 text-gray-500 dark:text-neutral-500" size={18} />}
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
            {title}
          </p>
        </div>
      </div>
      <div className="p-4 md:p-5">
        {
          children
        }
      </div>
    </div>
  );
}

export default Box;
