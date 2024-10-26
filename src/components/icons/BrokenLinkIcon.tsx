import { FC, SVGProps } from 'react';

const BrokenLinkIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...otherProps}>
      <g clipPath="url(#clip0_1401_4596)">
        <path
          d="M16.6992 7.30015L19.2867 4.71265"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
        <path
          d="M21.5 9H18"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
        <path
          d="M15 2.5V6"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
        <path
          d="M7.30078 16.7L4.70703 19.2937"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
        <path
          d="M9 21.5V18"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
        <path
          d="M2.5 15H6"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
        <path
          d="M12.2875 6.2875L8.74375 2.74375C7.95 1.95 6.86875 1.5 5.74375 1.5C3.4 1.5 1.5 3.4 1.5 5.74375C1.5 6.86875 1.95 7.95 2.74375 8.74375L6.3 12.3"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
        <path
          d="M17.7117 11.7124L21.2555 15.2562C22.0492 16.0499 22.4992 17.1312 22.4992 18.2562C22.4992 20.5999 20.5992 22.4999 18.2555 22.4999C17.1305 22.4999 16.0492 22.0499 15.2555 21.2562L11.6992 17.6999"
          stroke="currentColor"
          strokeWidth="2.51667"
          strokeMiterlimit="10"
        />
      </g>
      <defs>
        <clipPath id="clip0_1401_4596">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

BrokenLinkIcon.displayName = 'BrokenLinkIcon';
export default BrokenLinkIcon;
