import { useWallet } from '@aptos-labs/wallet-adapter-react';

const useMovementAptosAuthHook = () => {
  const { signMessage, disconnect } = useWallet();

  const handleSignMovementAptosMessage = async (nonce: string) => {
    try {
      const res: any = await signMessage({
        nonce: nonce,
        message: nonce,
      });

      return res.signature.toString() ?? '';
    } catch (err) {
      console.log('err', err);

      return '';
    }
  };

  const handleDisconnectMovementAptos = async () => {
    disconnect();
  };

  return {
    handleDisconnectMovementAptos,
    handleSignMovementAptosMessage,
  };
};

export default useMovementAptosAuthHook;
