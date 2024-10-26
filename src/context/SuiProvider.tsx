'use client';

import React, { memo, ReactNode } from 'react';
import {
  WalletProvider,
  SuiClientProvider,
  createNetworkConfig,
} from '@mysten/dapp-kit';
import { useAppContext } from '.';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import type { StateStorage } from 'zustand/middleware';
import { NetworkModeEnum, SupportedChainEnum } from '@/models';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const networkConfigSui = createNetworkConfig({
  devnet: { url: getFullnodeUrl(NetworkModeEnum.DEV_NET) },
  mainnet: { url: getFullnodeUrl(NetworkModeEnum.MAIN_NET) },
  testnet: { url: getFullnodeUrl(NetworkModeEnum.TEST_NET) },
}).networkConfig;

const networkConfigSuiMovement = createNetworkConfig({
  devnet: {
    url: getFullnodeUrl('devnet'),
  },
  mainnet: {
    url: getFullnodeUrl('mainnet'),
  },
  testnet: {
    url: 'https://devnet.baku.movementlabs.xyz:443',
  },
}).networkConfig;

const queryClient = new QueryClient();

const SuiProvider: React.FC<SuiProviderProps> = ({ children }) => {
  const { selectedChain } = useAppContext();

  const network =
    process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
      ? NetworkModeEnum.MAIN_NET
      : process.env.NETWORK_MODE === NetworkModeEnum.TEST_NET
        ? NetworkModeEnum.TEST_NET
        : NetworkModeEnum.TEST_NET; // Always use testnet

  const getItem = (name: string) => {
    return typeof window !== 'undefined' ? localStorage.getItem(name) : '';
  };

  const setItem = (name: string, value: string) => {
    return typeof window !== 'undefined'
      ? localStorage.setItem(name, value)
      : '';
  };

  const removeItem = (name: string) => {
    return typeof window !== 'undefined' ? localStorage.removeItem(name) : '';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={
          selectedChain === SupportedChainEnum.Sui
            ? networkConfigSui
            : networkConfigSuiMovement
        }
        defaultNetwork={network}
      >
        <WalletProvider
          autoConnect
          storage={
            {
              getItem: getItem,
              setItem: setItem,
              removeItem: removeItem,
            } as StateStorage
          }
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default memo(SuiProvider);

interface SuiProviderProps {
  children: ReactNode;
}
