import React, { ReactElement } from 'react';
import { Athlete } from '@/app/lib/definitions';

type ContactBoxContentProps = Pick<
  Athlete,
  'email' | 'phone' | 'address'
>;

const ContactBoxContent: React.FC<ContactBoxContentProps> = ({
  email,
  phone,
  address,

}): ReactElement => {
  return (
    <>
      <div className="flex justify-between flex-wrap gap-4 md:gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Phone</h3>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{phone || 'Not provided'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Email</h3>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{email || 'Not provided'}</p>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Address</h3>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{address || 'Not provided'}</p>
        </div>
      </div>
    </>
  );
};

export default ContactBoxContent;
