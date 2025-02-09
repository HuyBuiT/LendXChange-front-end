'use client';

import React from 'react';
import { ImageAssets } from 'public';
import { twJoin } from 'tailwind-merge';
import { useAppContext } from '@/context';
import { SupportedChainEnum } from '@/models';
import { CommonButton, CommonDialog } from '.';
import { useTranslation } from 'react-i18next';
import { AppConstant, LangConstant, PathConstant } from '@/const';
import { CommonDialogProps } from './common-dialog';
import { useWindowSize } from '@/hooks/common-hooks';
import Image from 'next/image';
import Link from 'next/link';

const NoCollaboratorCardDialog: React.FC<CommonDialogProps> = ({
  isOpen,
  onClose,
  ...otherProps
}) => {
  const { windowWidth } = useWindowSize();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getAffiliateLabel } = useTranslation(LangConstant.NS_AFFILIATE);

  const { selectedChain } = useAppContext();

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={''}
      isShowIconClose={windowWidth <= AppConstant.BREAK_POINTS.sm}
      closeIconClassName="top-4 right-4"
      contentClassName="bg-borderNoCollaboratorDialog p-[1px] overflow-visible"
      {...otherProps}
    >
      <Image
        src={ImageAssets.EnsoShadowLogoImage}
        alt="Enso Shadow Logo Image"
        className={twJoin(
          'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
        )}
      />
      <div
        className={twJoin(
          'w-full h-full',
          'px-6 pt-20 pb-11',
          'flex flex-col items-center',
          'bg-bgNoCollaboratorDialog rounded-2xl',
        )}
      >
        <p className={twJoin('w-3/4 text-center text-lg font-semibold')}>
          {getHomeLabel('msgDontHaveContributor')}
        </p>
        <p
          className={twJoin(
            'w-5/6 text-sm font-medium mt-6 mb-12 text-neutral4',
          )}
        >
          {selectedChain === SupportedChainEnum.Sui
            ? getHomeLabel('msgCheckOutTheDifferent')
            : getHomeLabel('msgStayTunedForUpdates')}
        </p>
      </div>
    </CommonDialog>
  );
};

export default NoCollaboratorCardDialog;
