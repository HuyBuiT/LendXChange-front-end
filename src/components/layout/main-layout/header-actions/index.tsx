'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';
import { useAuthContext } from '@/context';

import ConnectWalletButton from './ConnectWalletButton';
import AccountButton from './account-button';
import ChainButton from './ChainButton';

const HeaderActions = () => {
  const { isWalletConnected } = useAuthContext();

  return (
    <div className={twJoin('space-between-root gap-x-2')}>

      <ChainButton />
      {isWalletConnected ? (
        <div className={twJoin('gap-x-2', 'flex items-center')}>
          <AccountButton />
        </div>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
};

export default HeaderActions;
