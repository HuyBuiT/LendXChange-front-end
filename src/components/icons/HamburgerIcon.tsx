import { FC, SVGProps } from 'react';

const HamburgerIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...otherProps}>
      <g clipPath="url(#clip0_1461_1811)">
        <path
          d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1461_1811">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

HamburgerIcon.displayName = 'HamburgerIcon';
export default HamburgerIcon;
