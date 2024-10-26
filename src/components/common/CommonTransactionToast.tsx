'use client';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { BlockchainTransactionStatusEnum, SupportedChainEnum } from '@/models';
import { CloseCircleIcon, ExchangeIcon, ExternalLinkIcon } from '../icons';

import CommonToast from './common-toast';
import SuccessIcon from '../icons/SuccessIcon';
import { CommonUtils } from '@/utils';

const CommonTransactionToast: React.FC<CommonTransactionToastProps> = ({
  chain,
  status,

  transactionHash,
  contentClassName,

  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const [isOpenToast, setIsOpenToast] = useState(false);

  const { title, icon } = useMemo(() => {
    if (status === BlockchainTransactionStatusEnum.SUCCESS) {
      return {
        title: getLabel('lTransactionSucceeded'),
        icon: <SuccessIcon className="text-success2" />,
      };
    } else if (status === BlockchainTransactionStatusEnum.FAILED) {
      return {
        title: getLabel('lTransactionFailed'),
        icon: <CloseCircleIcon className="text-error2" />,
      };
    } else {
      return {
        title: getLabel('lTransactionSent'),
        icon: <ExchangeIcon className="text-neutral1" />,
      };
    }
  }, [status, getLabel]);

  useEffect(() => {
    if (transactionHash) {
      setIsOpenToast(true);
    }
  }, [transactionHash, status]);

  return (
    <CommonToast
      open={isOpenToast}
      duration={20000}
      onOpenChange={() => setIsOpenToast(false)}
      toastTitle={
        <div className="flex items-center gap-x-2">
          {icon} {title}
        </div>
      }
      {...otherProps}
    >
      <div className={twMerge('flex flex-col gap-y-2', contentClassName)}>
        {status === BlockchainTransactionStatusEnum.LOADING ? (
          <span className="text-sm text-neutral4">
            {getLabel('lWaitingTransaction')}
          </span>
        ) : (
          <Fragment />
        )}

        {Boolean(transactionHash) ? (
          <a
            className={twJoin(
              'underline',
              'flex items-center gap-x-1',
              'text-primary5 font-semibold',
            )}
            href={CommonUtils.getTransactionHashInfoLink(
              chain,
              transactionHash || '',
            )}
            target="_blank"
          >
            {getLabel('lViewYourTransaction')}
            <ExternalLinkIcon />
          </a>
        ) : (
          <Fragment />
        )}
      </div>
    </CommonToast>
  );
};

export default CommonTransactionToast;

interface CommonTransactionToastProps
  extends React.ComponentPropsWithoutRef<'div'> {
  chain: SupportedChainEnum;
  status?: BlockchainTransactionStatusEnum;

  transactionHash?: string;
  contentClassName?: string;
}
