'use client'
import React, { ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';

const AVATAR_IMAGES = [
  '/avatars-img/a-male-runner._06.07.2025.webp',
  '/avatars-img/a-female-runner._06.07.2025.webp',
  '/avatars-img/a-muscular-male-runner-with-a-space-look._06.07.2025.webp',
  '/avatars-img/a-female-runner-with-a-muscular-build-is-captured-_06.07.2025.webp',
  '/avatars-img/a-male-runner-with-a-muscular-build-is-captured-in_06.07.2025.webp',
  '/avatars-img/a-male-runner-with-a-muscular-build-wearing-a-fitt_06.07.2025.webp',
  '/avatars-img/a-muscular-female-runner-with-tanned-skin-and-a-st_06.07.2025.webp',
  '/avatars-img/a-muscular-male-runner-with-an-athletic-build-wear_06.07.2025.webp',
  '/avatars-img/a-muscular-male-runner-with-short-black-hair-and-a_06.07.2025.webp',
  '/avatars-img/a-muscular-female-runner-with-an-athletic-build-sh_06.07.2025.webp'
] as const;


type Props =  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const ProfileUrlInputField: React.FC<Props> = (props): ReactElement=> {
  const initialValue = props.value || props.defaultValue || '';
  const [value, setValue] = useState(initialValue);

  // Only select a random avatar if no initial value is provided
  useEffect(() => {
    if (!initialValue) {
      const randomIndex = Math.floor(Math.random() * AVATAR_IMAGES.length);
      const randomAvatar = AVATAR_IMAGES[randomIndex];
      setValue(randomAvatar);
    }
  }, [initialValue]);


  return (
    <div className={'flex gap-4'}>
      {
        value && <Image
        loader={({ src }) => src}
          width={150}
          height={150}
          src={value as string}
          alt={'profile image'}
          priority={true}
        />
      }
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
export default ProfileUrlInputField;
