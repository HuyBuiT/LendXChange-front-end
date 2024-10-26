'use client';

import React, { FC } from 'react';
import { CommonDialog } from '.';
import { ImageAssets } from 'public';
import { PathConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useAuthContext } from '@/context';
import { useTranslation } from 'react-i18next';
import { AccountInfoInterface } from '@/models';
import { CommonDialogProps } from './common-dialog';
import { useAppService } from '@/hooks/service-hooks';
import Image from 'next/image';
import Link from 'next/link';

const FeedbackPopup: FC<FeedbackPopupProps> = ({
  isOpen,
  paramsPost,

  onClose,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { handleAccountInfo } = useAuthContext();
  const { handlePostAccountSetting } = useAppService();

  const handleDoNotShowAgain = async () => {
    const res = await handlePostAccountSetting(paramsPost);

    if (res) {
      await handleAccountInfo();
    }

    onClose();
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      dialogTitle={''}
      onClose={onClose}
      closeIconClassName="right-4 top-4 z-50"
      contentClassName={twJoin(
        'p-0',
        'w-full sm:w-[397px] h-[80vh] h-auto overflow-visible z-[1000]',
      )}
      {...otherProps}
    >
      <Image
        src={ImageAssets.EnsoShadowLogoImage}
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 -top-[60px] z-50"
      />

      <div className="w-full h-2/5 absolute top-0 bg-bgModalClaimReferralTop z-[1] rounded-t-2xl" />
      <div
        className={twJoin('flex flex-col items-center', 'mt-[77px] mb-9 px-6')}
      >
        <p className="text-lg font-semibold z-[100]">
          {getLabel('lWeValueYourFeedback')}
        </p>

        <p className="text-sm font-medium text-neutral4/80 mt-4 px-7">
          {getLabel('msgYourExperience')}
        </p>

        <Link
          className={twJoin(
            'w-full rounded',
            'py-3 mt-14 mb-4',
            'text-center text-sm',
            'bg-primary5 hover:bg-primary5/80',
          )}
          href={PathConstant.FEEDBACK_FORM_LINK}
          target="_blank"
          onClick={handleDoNotShowAgain}
        >
          {getLabel('lGiveFeedback')}
        </Link>
        <button
          className="text-sm text-neutral4/80 font-medium"
          onClick={handleDoNotShowAgain}
        >
          {getLabel('lDoNotShowAgain')}
        </button>
      </div>
    </CommonDialog>
  );
};

export default FeedbackPopup;

interface FeedbackPopupProps extends CommonDialogProps {
  paramsPost: AccountInfoInterface;
}
