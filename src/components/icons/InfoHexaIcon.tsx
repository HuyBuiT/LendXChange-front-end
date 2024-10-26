import { FC, SVGProps } from 'react';

const InfoHexaIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...otherProps}>
      <g clipPath="url(#clip0_1884_1900)">
        <path
          d="M13.2797 2.08301L17.9163 6.72217V13.2805L13.2797 17.9163H6.72134L2.08301 13.2797V6.72134L6.72134 2.08301H13.2797ZM12.5888 3.74967H7.41134L3.75051 7.41217V12.5897L7.41134 16.2513H12.5888L16.2505 12.5897V7.41134L12.5888 3.75051V3.74967ZM9.16634 12.4997H10.833V14.1663H9.16634V12.4997ZM9.16634 5.83301H10.833V10.833H9.16634V5.83301Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1884_1900">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

InfoHexaIcon.displayName = 'InfoHexaIcon';
export default InfoHexaIcon;
