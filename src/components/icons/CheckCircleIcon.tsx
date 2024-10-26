import { FC, SVGProps } from 'react';

const CheckCircleIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...otherProps}>
      <path
        d="M10.0013 18.3337C5.3988 18.3337 1.66797 14.6028 1.66797 10.0003C1.66797 5.39783 5.3988 1.66699 10.0013 1.66699C14.6038 1.66699 18.3346 5.39783 18.3346 10.0003C18.3346 14.6028 14.6038 18.3337 10.0013 18.3337ZM9.17047 13.3337L15.0621 7.44116L13.8838 6.26283L9.17047 10.977L6.81297 8.61949L5.63464 9.79783L9.17047 13.3337Z"
        fill="currentColor"
      />
    </svg>
  );
};

CheckCircleIcon.displayName = 'CheckCircleIcon';
export default CheckCircleIcon;
