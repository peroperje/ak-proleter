'use client';
import React, { ReactElement, useState } from 'react';
import Image from 'next/image';

const AVATAR_IMAGES = [
  '/avatars-img/a-female-runner.webp',
  '/avatars-img/a-female-runner-with-a-muscular-build-is-captured-1.webp',
  '/avatars-img/a-female-runner-with-a-muscular-build-is-captured.webp',
  '/avatars-img/a-male-runner.webp',
  '/avatars-img/a-male-runner-with-a-muscular-build-is-captured-in.webp',
  '/avatars-img/a-male-runner-with-a-muscular-build-wearing-a-fitt.webp',
  '/avatars-img/a-muscular-female-runner-with-an-athletic-build-sh.webp',
  '/avatars-img/a-muscular-female-runner-with-tanned-skin-and-a-st.webp',
  '/avatars-img/a-muscular-male-runner-with-an-athletic-build-wear.webp',
  '/avatars-img/a-muscular-male-runner-with-a-space-look.webp',
  '/avatars-img/a-muscular-male-runner-with-short-black-hair-and-a.webp',
] as const;

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ProfileUrlInputField: React.FC<Props> = (props): ReactElement => {
  const { defaultValue, ...restInputProps } = props;
  const [value, setValue] = useState(defaultValue || AVATAR_IMAGES[0]);

  return (
    <div className={'flex gap-4'}>
      {value && (
        <Image
          loader={({ src, width, quality }) => {
            return `${src}?w=${width}&q=${quality || 75}`;
          }}
          width={150}
          height={150}
          src={value as string}
          alt={'profile image'}
          priority={true}
        />
      )}
      <div className={'flex flex-col gap-4'}>
        <input
          {...restInputProps}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className={'flex flex-wrap gap-4'}>
          {AVATAR_IMAGES.map((avatar, index) => (
            <Image
              key={`${avatar}-${index}`}
              width={50}
              height={50}
              src={avatar}
              alt={'avatar option'}
              onClick={() => setValue(avatar)}
              className={'cursor-pointer'}
              priority={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProfileUrlInputField;
