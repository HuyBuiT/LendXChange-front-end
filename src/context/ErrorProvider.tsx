'use client';

import React, { useContext, useEffect, useState } from 'react';

import {
  SolanaWalletsEnum,
  SupportedChainEnum,
  ErrorContextInterface,
} from '@/models';

import { twJoin } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useAppContext, useAuthContext } from '.';
import { CommonDialog } from '@/components/common';
import { ApiConstant, AppConstant, PathConstant } from '@/const';

import Cookies from 'js-cookie';

const INITIAL_STATE = {} as ErrorContextInterface;

const ErrorContext = React.createContext(INITIAL_STATE);

export const useErrorContext = () => useContext(ErrorContext);

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const router = useRouter();
  const [errorData, setErrorData] = useState(DEFAULT_ERROR_CONNECT_DATA);
  const { handleConnectSol, setConnectedChainAddress, handleLoginSui } =
    useAuthContext();
  const { selectedChain, selectedWallet } = useAppContext();

  const handleGetApiResponseError = () => {
    const status = localStorage.getItem(AppConstant.KEY_API_RESPONSE);

    if (Number(status) === ApiConstant.STT_UNAUTHORIZED) {
      localStorage.removeItem(AppConstant.KEY_API_RESPONSE);

      router.push(PathConstant.ROOT);
      handleReConnect();
    }
  };

  const handleReConnect = async () => {
    Cookies.remove(AppConstant.KEY_TOKEN);
    setConnectedChainAddress('');

    if (selectedChain === SupportedChainEnum.Sui) {
      await handleLoginSui(SupportedChainEnum.Sui);

      return;
    }
  };

  useEffect(() => {
    if (typeof window === undefined) return;

    window.addEventListener('storage', () => {
      handleGetApiResponseError();
    });
  }, []);

  return (
    <ErrorContext.Provider
      value={{ errorData: errorData, setErrorData: setErrorData }}
    >
      {children}
      <ErrorDialog
        title={errorData.title}
        message={errorData.message}
        isOpen={Boolean(errorData.message)}
        onClose={() => setErrorData(DEFAULT_ERROR_CONNECT_DATA)}
      />
    </ErrorContext.Provider>
  );
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

const DEFAULT_ERROR_CONNECT_DATA = {
  title: '',
  message: '',
};

const ErrorDialog: React.FC<ErrorConnectDialogProps> = ({
  isOpen,
  title,
  message,
  onClose,
}) => {
  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={title}
      titleClassName={twJoin('font-normal', 'text-lg text-neutral2')}
    >
      <p
        className={twJoin(
          'w-full',
          'mb-6 mt-8',
          'font-normal',
          'text-lg text-center',
        )}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {message}
      </p>
    </CommonDialog>
  );
};

interface ErrorConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}
