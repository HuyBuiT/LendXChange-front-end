import {
  Aptos,
  Network,
  AptosConfig,
  AccountAddress,
  Ed25519PublicKey,
} from '@aptos-labs/ts-sdk';
import { AppConstant } from '@/const';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ResSendSuiTransactionInterface } from './useSuiTransaction';

const useAptosMovementTransaction = () => {
  const aptosConfig = new AptosConfig({
    network: Network.CUSTOM,
    fullnode: process.env.APTOS_MOVEMENT_RPC_URL,
    indexer: process.env.APTOS_MOVEMENT_INDEXER_RPC_URL,
  });
  const aptosMovementClient = new Aptos(aptosConfig);

  const { signAndSubmitTransaction, account } = useWallet();

  const handleSendAptosMovementTransaction = async (data: any) => {
    try {
      const transaction = await aptosMovementClient.transaction.build.simple({
        sender: AccountAddress.fromString(account?.address || ''),
        data: data,
      });

      const [userTransactionResponse] =
        await aptosMovementClient.transaction.simulate.simple({
          signerPublicKey: new Ed25519PublicKey(String(account?.publicKey)),
          transaction,
        });

      if (userTransactionResponse.success) {
        const res = await signAndSubmitTransaction({
          data: data,
        });

        return {
          txHash: res.hash ?? '',
          messageError: '',
        } as ResSendSuiTransactionInterface;
      } else {
        return {
          txHash: '',
          messageError: userTransactionResponse.vm_status,
        } as ResSendSuiTransactionInterface;
      }
    } catch (error: any) {
      console.log('error', error);

      const message = MESSAGE_USER_REJECTED_APTOS_MOVEMENT_ERROR.includes(error)
        ? AppConstant.USER_REJECTED_MESSAGE
        : error.message;

      return {
        txHash: '',
        messageError: message,
      } as ResSendSuiTransactionInterface;
    }
  };

  return {
    handleSendAptosMovementTransaction,
  };
};

export default useAptosMovementTransaction;

const MESSAGE_USER_REJECTED_APTOS_MOVEMENT_ERROR = [
  'User rejected the request.',
  'User rejected the request',
];
