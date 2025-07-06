'use client'
import React, { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { RoundedCloseButton } from '@/app/ui/button';

const CloseBtn: React.FC = (): ReactElement=> {
  const router = useRouter();
  return <div className={'absolute top-0 right-0'}>
    <RoundedCloseButton onClick={() => router.back()} />
  </div>;
}

export default CloseBtn;
