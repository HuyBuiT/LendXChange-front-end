'use client';

import React, { ComponentPropsWithoutRef } from 'react';

const CommonTBody: React.FC<ComponentPropsWithoutRef<'tbody'>> = ({
  children,
  ...otherProps
}) => {
  return <tbody {...otherProps}>{children}</tbody>;
};

export default CommonTBody;
