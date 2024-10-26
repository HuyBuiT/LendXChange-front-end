import { FC, SVGProps } from 'react';

const EditIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" {...otherProps}>
      <path
        d="M9.1 4.57206L11.928 7.40072L5.328 14.0001H2.5V11.1714L9.1 4.57139V4.57206ZM10.0427 3.62939L11.4567 2.21472C11.5817 2.08974 11.7512 2.01953 11.928 2.01953C12.1048 2.01953 12.2743 2.08974 12.3993 2.21472L14.2853 4.10072C14.4103 4.22574 14.4805 4.39528 14.4805 4.57206C14.4805 4.74883 14.4103 4.91837 14.2853 5.04339L12.8707 6.45739L10.0427 3.62939Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default EditIcon;
