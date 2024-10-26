import React, { FC, SVGProps } from 'react';

const MenuTwoLineIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" {...otherProps}>
      <path
        d="M2.5 2.66675H14.5V4.00008H2.5V2.66675ZM2.5 7.33341H10.5V8.66675H2.5V7.33341ZM2.5 12.0001H14.5V13.3334H2.5V12.0001Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default MenuTwoLineIcon;
