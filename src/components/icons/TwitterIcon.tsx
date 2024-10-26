import { FC, SVGProps } from 'react';

const TwitterIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...otherProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.31514 3.58837L9.38759 3.86662L21.3551 20.0763L16.2794 20.2014L4.31514 3.58837ZM6.66971 4.87691L16.8617 19.029L19.1022 18.9738L8.77999 4.99267L6.66971 4.87691Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4268 11.4722L4.98828 19.992H7.7226L12.7313 13.2917L11.4268 11.4722ZM12.5082 10.0413L13.8273 11.8256L19.7926 3.8457H17.1903L12.5082 10.0413Z"
        fill="currentColor"
      />
    </svg>
  );
};

TwitterIcon.displayName = 'TwitterIcon';
export default TwitterIcon;
