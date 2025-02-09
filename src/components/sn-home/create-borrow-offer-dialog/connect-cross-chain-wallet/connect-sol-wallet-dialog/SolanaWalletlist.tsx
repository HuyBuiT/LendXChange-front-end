'use client';

import React from 'react';
import { ImageAssets } from 'public';
import { twJoin } from 'tailwind-merge';
import { BlockchainUtils } from '@/utils';
import { useTranslation } from 'react-i18next';
import { SolanaWalletsEnum, SupportedChainEnum } from '@/models';
import { useAppContext, useErrorContext, useHomeContext } from '@/context';
import useSolanaAuthHooks from '@/hooks/auth-hooks/solana-auth-hooks';
import WalletItem from './WalletItem';

const SolanaWalletList: React.FC<SolanaWalletListProps> = ({ onClose }) => {
  const { t: getLabel } = useTranslation();
  const { setErrorData } = useErrorContext();
  const { setSelectedWallet } = useAppContext();

  const { handleGetSolWalletAddress } = useSolanaAuthHooks();
  const { setCrossChainAddress, handleGetBalancesByChain } = useHomeContext();

  const handleConnectSol = async (selectedWallet: SolanaWalletsEnum) => {
    onClose();

    setSelectedWallet(selectedWallet);
    const provider = BlockchainUtils.getSolanaWalletsProvider(selectedWallet);

    if (!provider) {
      setErrorData({
        title: '',
        message: `${getLabel('msgNoProvider')} \n ${getLabel(
          'msgPleaseInstallExtension',
        )}`,
      });

      return;
    }

  };

  return (
    <div className={twJoin('w-full', 'flex flex-col gap-y-4')}>
      {Object.keys(SolanaWalletsEnum).map((value, index) => {
        return (
          <WalletItem
            key={index}
            title={(SolanaWalletsEnum as any)[value]}
            imgSrc={getSolWalletImage((SolanaWalletsEnum as any)[value])}
            onClick={() => handleConnectSol((SolanaWalletsEnum as any)[value])}
          />
        );
      })}
    </div>
  );
};

export default SolanaWalletList;

interface SolanaWalletListProps {
  onClose: () => void;
}

const getSolWalletImage = (walletType: SolanaWalletsEnum) => {
  switch (walletType) {
    case SolanaWalletsEnum.Backpack:
      return ImageAssets.BackpackWalletImage;
    case SolanaWalletsEnum.Phantom:
      return ImageAssets.PhantomWalletImage;
    case SolanaWalletsEnum.Solflare:
      return ImageAssets.SolflareWalletImage;
    default:
      return '';
  }
};
