import { FC, SVGProps } from 'react';

const CaretIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...otherProps}>
      <g clipPath="url(#clip0_1461_1839)">
        <path
          d="M11.9997 13.1719L16.9497 8.22192L18.3637 9.63592L11.9997 15.9999L5.63574 9.63592L7.04974 8.22192L11.9997 13.1719Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1461_1839">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

CaretIcon.displayName = 'CaretIcon';
export default CaretIcon;
