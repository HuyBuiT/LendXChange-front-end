'use client';

import { Trans, TransProps } from 'react-i18next';

const CommonI18Trans = ({
  href,
  childRef,
  ...otherProps
}: CommonI18TransProps) => {
  return (
    <Trans
      components={{
        a: (
          <a href={href} ref={childRef} target="_blank" className="underline" />
        ),
      }}
      {...otherProps}
    />
  );
};

interface CommonI18TransProps extends TransProps<any> {
  href?: string;
  childRef?: any;
}

export default CommonI18Trans;
