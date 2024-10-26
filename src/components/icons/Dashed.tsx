import { FC, SVGProps } from 'react';

const Dashed: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="2" height="66" viewBox="0 0 2 66" fill="none" {...otherProps}>
      <path d="M1 0V66" stroke="currentColor" strokeDasharray="4 4" />
    </svg>
  );
};

export default Dashed;
