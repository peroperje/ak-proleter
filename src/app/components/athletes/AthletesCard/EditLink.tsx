import React, { ReactElement } from 'react';
import { icons } from '@/app/lib/icons';
import Link from 'next/link';
import { navItems } from '@/app/lib/routes';

const IconComponent = icons.edit;
const EditLink: React.FC = (): ReactElement => (
  <Link  className={'absolute z-20 p-3 top-3 right-3'} href={navItems.athletes.href({ id: 'new' }) } passHref={ true}>
    <IconComponent  />
  </Link>
);

export default EditLink;
