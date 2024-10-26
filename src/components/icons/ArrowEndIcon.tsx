import { FC, SVGProps } from 'react';

const ArrowEndIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <g clipPath="url(#clip0_4738_3682)">
        <path d="M11 12L17 6V18L11 12Z" fill="currentColor" />
        <path d="M6 16L8 16L8 7L6 7L6 16Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_4738_3682">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ArrowEndIcon;
