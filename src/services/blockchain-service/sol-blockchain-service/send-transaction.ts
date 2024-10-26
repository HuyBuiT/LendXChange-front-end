import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { SolanaWalletsEnum } from '@/models';
import { web3 } from '@project-serum/anchor';
import { ReqSendTransactionInterface, ResSendTransactionInterface } from '..';
import { handleGetErrorMessage } from '@/services/blockchain-service/sol-blockchain-service/helper';

export const handleSendSolTransaction = async (
  params: ReqSendTransactionInterface,
) => {
  const { transactionData, rpcEndpoint, walletAddress, getLabel } = params;
  const currentWalletProvider = localStorage.getItem(
    AppConstant.SOLANA_PROVIDER,
  ) as SolanaWalletsEnum;

  if (
    !currentWalletProvider ||
    !walletAddress ||
    !rpcEndpoint ||
    Array.isArray(transactionData)
  )
    return {} as ResSendTransactionInterface;

  try {
    const connection = new web3.Connection(rpcEndpoint, 'finalized');

    const provider = BlockchainUtils.getSolanaWalletsProvider(
      currentWalletProvider,
    );

    const feePayer = new web3.PublicKey(walletAddress);
    const blockhash = (await connection.getLatestBlockhash('finalized'))
      .blockhash;

    transactionData.recentBlockhash = blockhash;
    transactionData.feePayer = feePayer;

    const [estimatedFee, solBalance] = await Promise.all([
      transactionData.getEstimatedFee(connection),
      connection.getBalance(feePayer),
    ]);

    if (solBalance < Number(estimatedFee)) {
      return {
        txHash: '',
        messageError: getLabel('msgNotEnoughLamportsSol'),
      };
    }

    const simulateResult: any =
      await connection.simulateTransaction(transactionData);

    if (simulateResult.value.err) {
      const messageError = handleGetErrorMessage(
        simulateResult.value.logs,
        getLabel,
      );

      return {
        txHash: '',
        messageError: messageError,
      } as ResSendTransactionInterface;
    } else {
      let txHash = '';
      if (provider?.isBitKeep) {
        txHash = await provider.signSendTransaction(transactionData);
      } else {
        const { signature } =
          await provider.signAndSendTransaction(transactionData);

        txHash = signature;
      }

      return {
        txHash: txHash,
        messageError: '',
      } as ResSendTransactionInterface;
    }
  } catch (error: any) {
    console.log(error);

    const message = MESSAGE_USER_REJECTED_SOL_ERROR.includes(error.message)
      ? AppConstant.USER_REJECTED_MESSAGE
      : error.message;

    return {
      txHash: '',
      messageError: message,
    } as ResSendTransactionInterface;
  }
};

export const MESSAGE_USER_REJECTED_SOL_ERROR = [
  'User rejected the request.',
  'Approval Denied',
];
