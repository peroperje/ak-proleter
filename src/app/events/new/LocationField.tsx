'use client'
import React, { ReactElement } from 'react';

const LocationField: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (props): ReactElement=> {
  return <div >
    <input
      {...props}
    />
  </div>;
}

export default LocationField;
