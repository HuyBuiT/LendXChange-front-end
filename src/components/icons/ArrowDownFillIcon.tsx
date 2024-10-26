import { FC, SVGProps } from 'react';

const ArrowDownFillIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path d="M8 12L14 6L14 18L8 12Z" fill="currentColor" />
    </svg>
  );
};

export default ArrowDownFillIcon;
