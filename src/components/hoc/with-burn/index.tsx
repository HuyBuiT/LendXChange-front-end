'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import {
  SupportedChainEnum,
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import { useAppContext, useAuthContext } from '@/context';

import useTransaction from '@/hooks/blockchain-hooks';

const withBurnController = (StarterComponent: HOCControllerInterface) => {
  const WithBurnComponent = (props: any) => {
    const { selectedChain } = useAppContext();
    const { connectedChainAddress } = useAuthContext();
    const { handleGetTransactionResult } = useTransaction();

    const [transactionHash, setTransactionHash] = useState('');
    const [transactionStatus, setTransactionStatus] =
      useState<BlockchainTransactionStatusEnum>();


    return (<></>);
  };

  return WithBurnComponent;
};

export default withBurnController;

export interface WithBurnComponentProps {
  status: BlockchainTransactionStatusEnum;
  onResetData: () => void;
}
