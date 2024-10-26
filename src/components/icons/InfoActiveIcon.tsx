import { FC, SVGProps } from 'react';

const InfoActiveIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" {...otherProps}>
      <g clip-path="url(#clip0_3339_10130)">
        <path
          d="M7.5 1.75C4.04813 1.75 1.25 4.54813 1.25 8C1.25 11.4519 4.04813 14.25 7.5 14.25C10.9519 14.25 13.75 11.4519 13.75 8C13.75 4.54813 10.9519 1.75 7.5 1.75ZM6.875 6.125V4.875H8.125V6.125H6.875ZM6.875 11.125V7.375H8.125V11.125H6.875Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_3339_10130">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="matrix(1 0 0 -1 0 15.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default InfoActiveIcon;
