import { FC, SVGProps } from 'react';

const SortIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <g clipPath="url(#clip0_209_3000)">
        <path
          d="M13.3333 2.6665V10.6665H15.3333L12.6667 13.9998L10 10.6665H12V2.6665H13.3333ZM8 11.9998V13.3332H2V11.9998H8ZM9.33333 7.33317V8.6665H2V7.33317H9.33333ZM9.33333 2.6665V3.99984H2V2.6665H9.33333Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_209_3000">
          <rect width="16" height="16" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SortIcon;
