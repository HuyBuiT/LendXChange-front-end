'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { CommonUtils } from '@/utils';
import { LangConstant } from '@/const';
import { SupportedChainEnum } from '@/models';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { SquareDocumentIcon } from '@/components/icons';

const TxidComponent: React.FC<TxidComponentProps> = ({
  chain,
  className,
  transactionHash,
  ...otherProps
}) => {
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);
  return (
    <div
      className={twMerge('w-full', 'space-between-root', className)}
      {...otherProps}
    >
      <span className="text-neutral5">{getLendLabel('lTxid')}</span>
      <div className={twJoin('flex items-center gap-x-2', 'text-primary5')}>
        <a
          target="_blank"
          href={CommonUtils.getTransactionHashInfoLink(chain, transactionHash)}
          className="underline decoration-2 font-semibold"
        >
          {CommonUtils.truncateHash(transactionHash)}
        </a>
        <SquareDocumentIcon width={20} height={20} />
      </div>
    </div>
  );
};

export default TxidComponent;

interface TxidComponentProps extends ComponentPropsWithoutRef<'div'> {
  chain: SupportedChainEnum;
  transactionHash: string;
}
