'use client';

import React from 'react';
import { ImageAssets } from 'public';
import { twJoin } from 'tailwind-merge';
import { SolanaWalletsEnum, SupportedChainEnum } from '@/models';
import { useAppContext, useAuthContext } from '@/context';

import WalletItem from './WalletItem';

const SolanaWalletList: React.FC<SolanaWalletListProps> = ({ onClose }) => {
  const { handleConnectSol } = useAuthContext();
  const { selectedChain } = useAppContext();
  const handleConnect = async (selectedWallet: SolanaWalletsEnum) => {
    onClose();

    await handleConnectSol(selectedWallet);
  };

  const solanaWalletList = [
    SolanaWalletsEnum.Backpack,
    SolanaWalletsEnum.Phantom,
    SolanaWalletsEnum.Solflare,
    SolanaWalletsEnum.Bitget,
  ];

  const eclipseWalletList = [
    SolanaWalletsEnum.Backpack,
    SolanaWalletsEnum.Salmon,
  ];

  return (
    <div className={twJoin('w-full', 'flex flex-col gap-y-4')}>
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
    case SolanaWalletsEnum.Bitget:
      return ImageAssets.BitgetWalletImage;
    case SolanaWalletsEnum.Salmon:
      return ImageAssets.SalmonWalletImage;
    default:
      return '';
  }
};
