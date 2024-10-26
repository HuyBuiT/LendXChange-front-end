'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import {
  NftBurnDataType,
  NFTSuiObjectType,
  NFTSolanaAssetType,
  SupportedChainEnum,
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import { useAppContext, useAuthContext, useReferralContext } from '@/context';

import { CommonTransactionToast } from '@/components/common';
import usePointSystemHooks from '@/hooks/point-system-hooks';
import useTransaction from '@/hooks/blockchain-hooks';

const withBurnController = (StarterComponent: HOCControllerInterface) => {
  const WithBurnComponent = (props: any) => {
    const { selectedChain } = useAppContext();
    const { connectedChainAddress } = useAuthContext();
    const {
      selectedCampaign,

      handleGetNftData,
      handleGetUserBoosted,
      handleGetLiveCampaignInfo,
      handleGetSelectedCampaignInfo,
    } = useReferralContext();
    const {
      handleSyncBurned,
      handleCreateBurn,
      handleBurnSuiNft,
      handleConfirmTransaction,
      handleSendEncodedTransaction,
    } = usePointSystemHooks();
    const { handleGetTransactionResult } = useTransaction();

    const [transactionHash, setTransactionHash] = useState('');
    const [transactionStatus, setTransactionStatus] =
      useState<BlockchainTransactionStatusEnum>();

    const handleBurn = async (burnData: NftBurnDataType) => {
      setTransactionStatus(BlockchainTransactionStatusEnum.LOADING);

      if (selectedChain === SupportedChainEnum.Solana) {
        await handleBurnWithSolana(burnData as NFTSolanaAssetType[]);
      } else {
        await handleBurnWithSui(burnData as NFTSuiObjectType[]);
      }
    };

    const handleBurnWithSolana = async (burnData: NFTSolanaAssetType[]) => {
      const encodeTransaction = await handleCreateBurn(
        connectedChainAddress,
        String(burnData[0].assetId),
      );

      if (encodeTransaction) {
        await handleSendTransaction(encodeTransaction);
      } else {
        setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      }
    };

    const handleSendTransaction = async (encodeTransaction: string) => {
      const signature = await handleSendEncodedTransaction(
        connectedChainAddress,
        encodeTransaction,
      );

      if (signature) {
        setTransactionHash(signature);
        await handleConfirmTx(signature);
      } else {
        setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      }
    };

    const handleConfirmTx = async (signature: string) => {
      const res = await handleConfirmTransaction(signature);
      if (res) {
        await handleSyncBurned(signature);
        setTransactionStatus(BlockchainTransactionStatusEnum.SUCCESS);
        setTimeout(() => {
          handleReset();

          handleGetNftData();
          handleGetUserBoosted();
          selectedCampaign?.id &&
            handleGetSelectedCampaignInfo(selectedCampaign?.id);
          handleGetLiveCampaignInfo();
        }, 4000);
      } else {
        setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      }
    };

    const handleReset = () => {
      setTransactionHash('');
      setTransactionStatus(undefined);
    };

    const handleBurnWithSui = async (burnData: NFTSuiObjectType[]) => {
      const transactionHash = await handleBurnSuiNft(
        burnData,
        connectedChainAddress,
      );

      if (transactionHash) {
        await handleGetStatusBurnSuiNft(transactionHash);
        setTransactionHash(transactionHash);
      } else {
        setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      }
    };

    const handleGetStatusBurnSuiNft = async (transactionHash: string) => {
      const status = await handleGetTransactionResult(
        SupportedChainEnum.Sui,
        transactionHash,
      );

      if (status === BlockchainTransactionStatusEnum.SUCCESS) {
        setTimeout(() => {
          handleReset();
          handleGetNftData();
          handleGetUserBoosted();
          selectedCampaign?.id &&
            handleGetSelectedCampaignInfo(selectedCampaign?.id);
          handleGetLiveCampaignInfo();
        }, 4000);
      }

      setTransactionStatus(status);
    };

    return (
      <>
        <StarterComponent
          onBurn={handleBurn}
          status={transactionStatus}
          onResetData={handleReset}
          {...props}
        />

        {transactionHash &&
          ReactDOM.createPortal(
            <CommonTransactionToast
              chain={selectedChain}
              status={transactionStatus}
              transactionHash={transactionHash}
            />,
            document.body,
          )}
      </>
    );
  };

  return WithBurnComponent;
};

export default withBurnController;

export interface WithBurnComponentProps {
  status: BlockchainTransactionStatusEnum;
  onBurn: (burnData?: NftBurnDataType) => void;
  onResetData: () => void;
}
