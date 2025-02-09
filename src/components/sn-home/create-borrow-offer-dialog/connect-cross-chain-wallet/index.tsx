'use client';

import React, { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { CommonUtils } from '@/utils';
import { SupportedChainEnum } from '@/models';
import { useTranslation } from 'react-i18next';
import { WalletIcon } from '@/components/icons';
import { twJoin, twMerge } from 'tailwind-merge';
import { useAuthContext, useHomeContext } from '@/context';
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import ConnectSolWalletDialog from './connect-sol-wallet-dialog';

const ConnectWalletCrossChain: React.FC<ConnectWalletCrossChainProps> = ({
  selectChainBorrow,
}) => {
  const currentAccount = useCurrentAccount();

  const { connectedChainAddress } = useAuthContext();
  const { crossChainAddress, setCrossChainAddress, handleGetBalancesByChain } =
    useHomeContext();

  const [isOpenSui, setIsOpenSui] = useState(false);
  const [isOpenConnectDialog, setIsOpenConnectDialog] = useState(false);

  const handleGetBalances = async (address: string) => {
    await handleGetBalancesByChain(selectChainBorrow, address);
    setCrossChainAddress(address);
  };

  useEffect(() => {
    if (!connectedChainAddress && isOpenSui && currentAccount) {
      handleGetBalances(currentAccount?.address);
    }
  }, [currentAccount]);

  return crossChainAddress ? (
    <div
      className={twMerge(
        'rounded-r',
        'py-2 px-4',
        'cursor-pointer',
        'bg-characterBackground2',
        'flex items-center gap-x-4',
      )}
    >
      <WalletIcon className="text-neutral5" />
      <span className={twJoin('font-medium', 'text-neutral1 text-sm')}>
        {CommonUtils.truncateHash(crossChainAddress)}
      </span>
    </div>
  ) : selectChainBorrow === SupportedChainEnum.Sui ? (
    <ConnectModal
      trigger={<ConnectCrossChainButton onClick={() => setIsOpenSui(true)} />}
      open={isOpenSui}
      onOpenChange={(isOpen) => setIsOpenSui(isOpen)}
    />
  ) : (
    <>
      <ConnectCrossChainButton onClick={() => setIsOpenConnectDialog(true)} />

      <ConnectSolWalletDialog
        isOpen={isOpenConnectDialog}
        onClose={() => setIsOpenConnectDialog(false)}
      />
    </>
  );
};
export default ConnectWalletCrossChain;

interface ConnectWalletCrossChainProps {
  selectChainBorrow: SupportedChainEnum;
}

const ConnectCrossChainButton: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  return (
    <div
      className={twMerge(
        'rounded-r',
        'py-2 px-4',
        'cursor-pointer',
        'bg-characterBackground2',
        'flex items-center gap-x-4',
        className,
      )}
      {...otherProps}
    >
      <WalletIcon className="text-neutral5" />
      <span className={twJoin('font-medium', 'text-neutral1 text-sm')}>
        {getLabel('lConnectWallet')}
      </span>
    </div>
  );
};
