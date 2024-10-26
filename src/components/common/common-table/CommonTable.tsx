'use client';

import React, { ComponentPropsWithoutRef } from 'react';

const CommonTable: React.FC<ComponentPropsWithoutRef<'table'>> = ({
  children,
  ...otherProps
}) => {
  return <table {...otherProps}>{children}</table>;
};

export default CommonTable;
