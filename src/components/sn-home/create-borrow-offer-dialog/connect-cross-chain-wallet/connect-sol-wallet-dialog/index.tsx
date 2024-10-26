'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonDialog } from '@/components/common';
import SolanaWalletList from './SolanaWalletlist';

const ConnectSolWalletDialog: React.FC<ConnectWalletDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t: getLabel } = useTranslation();

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={getLabel('lConnectWallet')}
      titleClassName={twJoin('font-semibold', 'text-lg text-neutral2')}
    >
      <div className="w-full mt-5">
        <SolanaWalletList onClose={onClose} />
      </div>
    </CommonDialog>
  );
};

export default ConnectSolWalletDialog;

interface ConnectWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
