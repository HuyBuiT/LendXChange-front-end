import { FC, SVGProps } from 'react';

const ArrowDirectionIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...otherProps}>
      <g clipPath="url(#clip0_261_18717)">
        <path
          d="M16.172 10.9999L10.808 5.63592L12.222 4.22192L20 11.9999L12.222 19.7779L10.808 18.3639L16.172 12.9999H4V10.9999H16.172Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_261_18717">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

ArrowDirectionIcon.displayName = 'ArrowDirectionIcon';
export default ArrowDirectionIcon;
