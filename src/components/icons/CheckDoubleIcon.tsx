import { FC, SVGProps } from 'react';

const CheckDoubleIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <g clipPath="url(#clip0_261_18725)">
        <path
          d="M11.602 13.76L13.014 15.172L21.48 6.706L22.894 8.12L13.014 18L6.65 11.636L8.064 10.222L10.189 12.347L11.602 13.759V13.76ZM11.604 10.932L16.556 5.979L17.966 7.389L13.014 12.342L11.604 10.932ZM8.777 16.587L7.364 18L1 11.636L2.414 10.222L3.827 11.635L3.826 11.636L8.777 16.587Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_261_18725">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CheckDoubleIcon;
