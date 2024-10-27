'use client';

import React, { useContext, useEffect, useState } from 'react';

import {
  SolanaWalletsEnum,
  SupportedChainEnum,
  AuthContextInterface,
} from '@/models';

import {
  getBitgetProvider,
  getPhantomProvider,
  getSolflareProvider,
  getBackpackProvider,
  getSalmonProvider,
} from '@/utils/common.utils';

import { useErrorContext } from '.';
import { BlockchainUtils } from '@/utils';
import { useAppContext } from './AppProvider';
import { useTranslation } from 'react-i18next';
import { AppConstant, PathConstant } from '@/const';
import { useAppService } from '@/hooks/service-hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';

import Cookies from 'js-cookie';
import useAuthHook from '@/hooks/auth-hooks';
import useSolanaAuthHooks from '@/hooks/auth-hooks/solana-auth-hooks';

const INITIAL_STATE = {} as AuthContextInterface;

const AuthContext = React.createContext(INITIAL_STATE);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  accessToken,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentAccount = useCurrentAccount();

  const { account, wallet } = useWallet();
  const { t: getLabel } = useTranslation();
  const { setErrorData } = useErrorContext();
  const { currentWallet } = useCurrentWallet();
  const { handleGetAccountInfo } = useAppService();
  const { handleLogin, handleLogout } = useAuthHook();
  const {
    selectedChain,
    setAccountInfo,
    setSelectedChain,
    setSelectedWallet,
    selectedWallet,
  } = useAppContext();
  const { handleGetSolWalletAddress } = useSolanaAuthHooks();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isOpenConnectDialog, setIsOpenConnectDialog] = useState(false);
  const [connectedChainAddress, setConnectedChainAddress] = useState('');

  const handleAccountInfo = async () => {
    const res = await handleGetAccountInfo();

    setAccountInfo(res);
  };

  const handleDisconnect = async () => {
    await handleLogout(selectedChain);

    setIsWalletConnected(false);
    setConnectedChainAddress('');

    if (pathname !== PathConstant.ROOT) {
      router.push(PathConstant.ROOT);
    }
  };

  const handleConnectSol = async (selectedWallet: SolanaWalletsEnum) => {
    setSelectedWallet(selectedWallet);
    const currentWalletProvider = localStorage.getItem(
      AppConstant.SOLANA_PROVIDER,
    ) as SolanaWalletsEnum;

    if (!selectedWallet && !currentWalletProvider) return '';

    const provider = BlockchainUtils.getSolanaWalletsProvider(selectedWallet);

    if (!provider) {
      setErrorData({
        title: '',
        message: `${getLabel('msgNoProvider')} \n ${getLabel(
          'msgPleaseInstallExtension',
        )}`,
      });

      return '';
    }

    setIsConnecting(true);

    const address = await handleGetSolWalletAddress(selectedWallet);

    const solAddress = await handleLogin(
      address,
      selectedChain,
      selectedWallet,
    );

    if (solAddress) {
      setConnectedChainAddress(solAddress);
      setIsWalletConnected(true);
    } else {
      setConnectedChainAddress('');
      setIsWalletConnected(false);
    }

    setIsConnecting(false);
    return solAddress;
  };

  const handleReconnectSolWallet = async () => {
    const accessToken = Cookies.get(AppConstant.KEY_TOKEN);

    if (!accessToken) return;
    await handleConnectSol(selectedWallet);
  };

  const handleSwitchChain = async (chain: SupportedChainEnum) => {
    if (pathname !== PathConstant.ROOT) {
      router.push(PathConstant.ROOT);
    }

    if (chain === selectedChain) return;

    localStorage.setItem(AppConstant.KEY_CHAIN, chain);
    const accessTokenClient = Cookies.get(AppConstant.KEY_TOKEN);

    if (accessTokenClient || accessToken) {
      Cookies.remove(AppConstant.KEY_TOKEN);
    }

    await handleDisconnect();
    setSelectedChain(chain);

    setIsWalletConnected(false);
    setConnectedChainAddress('');
  };

  const handleLoginSui = async (selectedChain: SupportedChainEnum) => {
    if (!currentAccount) return;

    const accessTokenClient = Cookies.get(AppConstant.KEY_TOKEN);

    if (accessTokenClient) {
      setConnectedChainAddress(currentAccount?.address);
      setIsWalletConnected(true);
      return;
    }

    const address = await handleLogin(
      currentAccount.address,
      selectedChain,
      currentWallet?.name,
    );

    if (address) {
      setConnectedChainAddress(address);
      setIsWalletConnected(true);
    } else {
      setConnectedChainAddress('');
      setIsWalletConnected(false);
    }
  };

  const handleLoginAptosMovement = async (
    selectedChain: SupportedChainEnum,
  ) => {
    if (!account) return;

    const accessTokenClient = Cookies.get(AppConstant.KEY_TOKEN);

    if (accessTokenClient) {
      setConnectedChainAddress(account?.address);
      setIsWalletConnected(true);
      return;
    }

    const address = await handleLogin(
      account.address,
      selectedChain,
      wallet?.name,
      String(account.publicKey),
    );

    if (address) {
      setConnectedChainAddress(address);
      setIsWalletConnected(true);
    } else {
      setConnectedChainAddress('');
      setIsWalletConnected(false);
    }
  };


  const phantomProvider = getPhantomProvider();
  const backpackProvider = getBackpackProvider();
  const solflareProvider = getSolflareProvider();
  const bitgetProvider = getBitgetProvider();
  const salmonProvider = getSalmonProvider();

  useEffect(() => {
    if (!currentAccount?.address || !selectedChain) return;

    if (selectedChain === SupportedChainEnum.Sui) {
      handleLoginSui(SupportedChainEnum.Sui);
      return;
    }
  }, [currentAccount?.address, selectedChain]);

  useEffect(() => {
    if (!connectedChainAddress) return;
    handleAccountInfo();
  }, [connectedChainAddress, selectedChain]);

  return (
    <AuthContext.Provider
      value={{
        isWalletConnected,
        connectedChainAddress,
        setConnectedChainAddress,

        isConnecting,
        setIsConnecting,

        isOpenConnectDialog,
        setIsOpenConnectDialog,

        handleDisconnect,
        handleSwitchChain,

        handleAccountInfo,

        handleLoginSui,
        handleConnectSol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface AuthProviderProps {
  children: React.ReactNode;
  accessToken: string;
}
