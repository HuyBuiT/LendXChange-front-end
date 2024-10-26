import { FC, SVGProps } from 'react';

const CheckIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...otherProps}>
      <g clipPath="url(#clip0_1302_9290)">
        <path
          d="M9.99974 15.1715L19.1917 5.97852L20.6067 7.39252L9.99974 17.9995L3.63574 11.6355L5.04974 10.2215L9.99974 15.1715Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1302_9290">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CheckIcon;
