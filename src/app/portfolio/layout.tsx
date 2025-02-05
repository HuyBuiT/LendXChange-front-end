import React from 'react';
import { AppConstant } from '@/const';
import { PageWrapper } from '@/components/common';

export async function generateMetadata() {
  return {
    title: AppConstant.META_DATA_PORTFOLIO_DEFAULT.title,
    description: AppConstant.META_DATA_PORTFOLIO_DEFAULT.description,
    url: AppConstant.META_DATA_PORTFOLIO_DEFAULT.url,
    siteName: AppConstant.META_DATA_PORTFOLIO_DEFAULT.siteName,
    twitter: {
      card: 'summary_large_image',
      title: AppConstant.META_DATA_PORTFOLIO_DEFAULT.title,
      description: AppConstant.META_DATA_PORTFOLIO_DEFAULT.description,
      site: '@LendXChange_xyz',
      creator: '@LendXChange_xyz',
      images: [
        {
          url: AppConstant.META_DATA_PORTFOLIO_DEFAULT.urlImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    openGraph: {
      images: [
        {
          url: AppConstant.META_DATA_PORTFOLIO_DEFAULT.urlImage,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const PortfolioLayout = ({ children }: { children: React.ReactNode }) => {
  return <PageWrapper>{children}</PageWrapper>;
};

export default PortfolioLayout;
