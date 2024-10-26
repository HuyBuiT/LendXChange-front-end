import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { SolanaWalletsEnum } from '@/models';
import { web3 } from '@project-serum/anchor';
import { MESSAGE_USER_REJECTED_SOL_ERROR } from './send-transaction';
import { ReqSendTransactionInterface, ResSendTransactionInterface } from '..';
import { handleGetErrorMessage } from '@/services/blockchain-service/sol-blockchain-service/helper';

export const handleSendSolTransactions = async (
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
    !Array.isArray(transactionData)
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

    transactionData.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = feePayer;
    });

    const [estimatedFee, solBalance] = await Promise.all([
      transactionData[0].getEstimatedFee(connection),
      connection.getBalance(feePayer),
    ]);

    if (solBalance < Number(estimatedFee)) {
      return {
        txHash: '',
        messageError: getLabel('msgNotEnoughLamportsSol'),
      };
    }

    const simulateResult: any = await connection.simulateTransaction(
      transactionData[0],
    );

    if (simulateResult.value.err) {
      const messageError = handleGetErrorMessage(
        simulateResult.value.logs,
        getLabel,
      );
      console.log(simulateResult);
      return {
        txHash: '',
        messageError: messageError,
      } as ResSendTransactionInterface;
    } else {
      if (provider?.signAndSendAllTransactions) {
        const { signatures } =
          await provider.signAndSendAllTransactions(transactionData);

        return {
          txHash: signatures[0] || '',
          messageError: '',
        } as ResSendTransactionInterface;
      } else {
        const signedTransactions =
          await provider.signAllTransactions(transactionData);

        const transactions = await Promise.all(
          signedTransactions.map(async (transaction: web3.Transaction) => {
            return await connection.sendRawTransaction(transaction.serialize());
          }),
        );

        const signature = transactions.length > 0 ? transactions[0] : '';

        return {
          txHash: signature,
          messageError: '',
        } as ResSendTransactionInterface;
      }
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
