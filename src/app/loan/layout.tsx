import React, { ReactNode } from 'react';
import { PageWrapper } from '@/components/common';
import { AppConstant } from '@/const';

export async function generateMetadata() {
  return {
    title: AppConstant.META_DATA_LOAN_DEFAULT.title,
    description: AppConstant.META_DATA_LOAN_DEFAULT.description,
    url: AppConstant.META_DATA_LOAN_DEFAULT.url,
    siteName: AppConstant.META_DATA_LOAN_DEFAULT.siteName,
    twitter: {
      card: 'summary_large_image',
      title: AppConstant.META_DATA_LOAN_DEFAULT.title,
      description: AppConstant.META_DATA_LOAN_DEFAULT.description,
      site: '@EnsoFi_xyz',
      creator: '@EnsoFi_xyz',
      images: [
        {
          url: AppConstant.META_DATA_LOAN_DEFAULT.urlImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    openGraph: {
      images: [
        {
          url: AppConstant.META_DATA_LEND_DEFAULT.urlImage,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const LendLayout = async ({ children }: { children: ReactNode }) => {
  return <PageWrapper>{children}</PageWrapper>;
};

export default LendLayout;
