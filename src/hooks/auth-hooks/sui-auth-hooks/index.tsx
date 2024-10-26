import { useDisconnectWallet, useSignPersonalMessage } from '@mysten/dapp-kit';

const useSuiAuthHook = () => {
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();

  const handleSignSuiMessage = async (nonce: string) => {
    try {
      const res: any = await handleSignPersonalMessage(nonce);

      return res.signature ?? '';
    } catch (err) {
      return '';
    }
  };

  const handleSignPersonalMessage = (nonce: string) => {
    const message = new TextEncoder().encode(nonce);
    return new Promise((resolve, reject) => {
      signPersonalMessage(
        { message: message },
        {
          onSuccess: (result: any) => {
            resolve(result);
          },
          onError: (error: any) => {
            console.log('error', error);
            reject(error);
          },
        },
      );
    });
  };

  const handleDisconnectSui = async () => {
    disconnect();
  };

  return {
    handleDisconnectSui,
    handleSignSuiMessage,
  };
};

export default useSuiAuthHook;
