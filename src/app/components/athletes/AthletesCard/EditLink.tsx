import React, { ReactElement } from 'react';
import { EditIcon } from '@/app/lib/icons';
import Link from 'next/link';
import { routes } from '@/app/lib/routes';

interface EditLinkProps {
  id: string;
}

const IconComponent = EditIcon;
const EditLink: React.FC<EditLinkProps> = ({ id }): ReactElement => (
  <Link
    className={'absolute top-3 right-3 z-20 p-3'}
    href={routes.athletes.edit(id)}
    passHref={true}
  >
    <IconComponent />
  </Link>
);

export default EditLink;
