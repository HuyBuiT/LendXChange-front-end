import { AppConstant } from '@/const';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { handleGetErrorMessage } from '@/services/blockchain-service/sui-blockchain-service/helper';

const useSuiTransaction = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();

  const getObject = async (data: SuiGetObjectParamsType) => {
    if (Object.keys(data).length === 0) return;

    const { objectId } = data;

    const objectData = await suiClient.getObject({
      id: objectId,
      options: {
        showBcs: true,
        showType: true,
        showOwner: true,
        showContent: true,
        showDisplay: true,
        showStorageRebate: true,
        showPreviousTransaction: true,
      },
    });

    return objectData;
  };

  const getDynamicFieldByObject = async (
    data: SuiGetDynamicFieldObjectType,
  ) => {
    if (Object.keys(data).length === 0) return;

    const { parentId, name } = data;
    const objectData = await suiClient.getDynamicFieldObject({
      parentId: parentId,
      name: name,
    });

    return objectData;
  };

  const handleSendSuiTransaction = async (txb: any) => {
    try {
      if (!txb) return {} as ResSendSuiTransactionInterface;

      const simulateTransaction = await suiClient.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: String(currentAccount?.address),
      });

      const simulateStatus = simulateTransaction.effects.status;

      if (simulateStatus.status === 'success') {
        const res: any = await handleSignAndExecuteTransactionBlock(txb);

        // to do: update handle error
        return {
          txHash: res.digest ?? '',
          messageError: '',
        } as ResSendSuiTransactionInterface;
      } else {
        const message = handleGetErrorMessage(String(simulateStatus.error));

        return {
          txHash: '',
          messageError: message,
        } as ResSendSuiTransactionInterface;
      }
    } catch (error: any) {
      console.log('error', error.message);

      const message = MESSAGE_USER_REJECTED_SUI_ERROR.includes(error.message)
        ? AppConstant.USER_REJECTED_MESSAGE
        : error.message;

      return {
        txHash: '',
        messageError: message,
      } as ResSendSuiTransactionInterface;
    }
  };

  const handleSignAndExecuteTransactionBlock = (
    transactionData: TransactionBlock,
  ) => {
    return new Promise((resolve, reject) => {
      signAndExecuteTransactionBlock(
        { transactionBlock: transactionData },
        {
          onSuccess: (result: any) => {
            resolve(result);
          },
          onError: (error: any) => {
            reject(error);
          },
        },
      );
    });
  };

  return {
    getObject,
    getDynamicFieldByObject,

    handleSendSuiTransaction,
  };
};

export default useSuiTransaction;

export type SuiGetObjectParamsType = {
  objectId: string;
};

export type SuiGetDynamicFieldObjectType = {
  parentId: string;
  name: {
    type: string;
    value: any;
  };
};

export interface ResSendSuiTransactionInterface {
  txHash: string;
  messageError: string;
}

const MESSAGE_USER_REJECTED_SUI_ERROR = ['Rejected from user'];
