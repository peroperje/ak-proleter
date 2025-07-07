'use client'
import React, { ReactElement } from 'react';
import Image, {ImageProps} from 'next/image';

const ProfilePhotos: React.FC<ImageProps> = (props): ReactElement => (
  <>
    {
      !!props.src && <Image
        loader={({ src, width, quality }) => {
          return `${src}?w=${width}&q=${quality || 75}`
        }}
        width={40}
        height={40}
        {...props}
      />
    }
  </>
);

export default ProfilePhotos;
