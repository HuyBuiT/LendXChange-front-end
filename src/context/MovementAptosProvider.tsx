'use client';

import React, { PropsWithChildren } from 'react';
import { AppConstant } from '@/const';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

const MovementAptosProvider = ({ children }: PropsWithChildren) => {
  const wallets = [new MartianWallet()];

  return (
    <AptosWalletAdapterProvider
      autoConnect
      plugins={wallets}
      dappConfig={{ network: AppConstant.APTOS_MOVEMENT_NETWORK_CONFIG }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default MovementAptosProvider;
