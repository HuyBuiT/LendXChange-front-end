import React from 'react';
import {
  IntroSwiper,
  HomeContent,
  HomeContentWrapper,
} from '@/components/sn-home';
import { twJoin } from 'tailwind-merge';
import { AppConstant } from '@/const';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: string;
}) {
  let metadata = {
    title: AppConstant.META_DATA_HOME_DEFAULT.title,
    description: AppConstant.META_DATA_HOME_DEFAULT.description,
    url: AppConstant.META_DATA_HOME_DEFAULT.url,
    siteName: AppConstant.META_DATA_HOME_DEFAULT.siteName,
    twitter: {
      card: 'summary_large_image',
      title: AppConstant.META_DATA_HOME_DEFAULT.title,
      description: AppConstant.META_DATA_HOME_DEFAULT.description,
      site: '@LendXChange',
      creator: '@LendXChange',
      images: [
        {
          url: AppConstant.META_DATA_HOME_DEFAULT.urlImage,
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
  const params = new URLSearchParams(searchParams || '');

  const paramsObject = Object.fromEntries(params.entries());

  const shareValue = paramsObject.share;

  if (shareValue) {
    const statusRes = await fetch(
      `${process.env.DAPP_SERVICE_URL}/image?imageId=${shareValue}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (statusRes.ok) {
      const res = await statusRes.json();

      metadata = {
        ...metadata,
        twitter: {
          ...metadata.twitter,
          images: [
            {
              url: res.data.url,
              width: 1200,
              height: 630,
            },
          ],
        },
        openGraph: {
          images: [
            {
              url: res.data.url,
              width: 1200,
              height: 630,
            },
          ],
        },
      };
    }
  }

  return metadata;
}

const Home = () => {
  return (
    <main className="w-full h-full">
      <div
        className={twJoin(
          'sm:pt-6',
          'w-full h-full',
          'flex flex-col items-center ',
        )}
      >
        {/* <IntroSwiper /> */}

        <HomeContentWrapper className="z-[1]">
          <HomeContent />
        </HomeContentWrapper>
      </div>
    </main>
  );
};

export default Home;
