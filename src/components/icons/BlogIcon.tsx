import { FC, SVGProps } from 'react';

const BlogIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...otherProps}>
      <g clip-path="url(#clip0_4411_8081)">
        <path
          d="M20 2C20.7956 2 21.5587 2.31607 22.1213 2.87868C22.6839 3.44129 23 4.20435 23 5V7H21V19C21 19.7956 20.6839 20.5587 20.1213 21.1213C19.5587 21.6839 18.7956 22 18 22H4C3.20435 22 2.44129 21.6839 1.87868 21.1213C1.31607 20.5587 1 19.7956 1 19V17H17V19C17 19.2449 17.09 19.4813 17.2527 19.6644C17.4155 19.8474 17.6397 19.9643 17.883 19.993L18 20C18.2449 20 18.4813 19.91 18.6644 19.7473C18.8474 19.5845 18.9643 19.3603 18.993 19.117L19 19V4H6C5.75507 4.00003 5.51866 4.08996 5.33563 4.25272C5.15259 4.41547 5.03566 4.63975 5.007 4.883L5 5V15H3V5C3 4.20435 3.31607 3.44129 3.87868 2.87868C4.44129 2.31607 5.20435 2 6 2H20Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_4411_8081">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

BlogIcon.displayName = 'BlogIcon';
export default BlogIcon;
