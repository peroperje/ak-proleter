import React, { ReactElement } from 'react';
import { icons } from '@/app/lib/icons';
import Link from 'next/link';
import { navItems } from '@/app/lib/routes';

const IconComponent = icons.edit;
const EditLink: React.FC = (): ReactElement => (
  <Link
    className={'absolute top-3 right-3 z-20 p-3'}
    href={navItems.athletes.href({ id: 'new' })}
    passHref={true}
  >
    <IconComponent />
  </Link>
);

export default EditLink;
