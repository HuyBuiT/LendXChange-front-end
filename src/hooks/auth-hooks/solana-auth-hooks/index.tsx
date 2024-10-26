import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { SolanaWalletsEnum } from '@/models';
import bs58 from 'bs58';

const useSolanaAuthHooks = () => {
  const handleConnectSolWallet = async (selectedWallet: SolanaWalletsEnum) => {
    const provider = BlockchainUtils.getSolanaWalletsProvider(selectedWallet);

    if (!provider) return;

    localStorage.setItem(AppConstant.SOLANA_PROVIDER, selectedWallet);

    try {
      const data = await provider.connect();

      if (!Boolean(data)) return '';

      const publicKey = provider?.publicKey;
      if (!publicKey) return;

      const address = publicKey.toString();

      return address;
    } catch (error) {
      console.log(error);
      return '';
    }
  };

  const handleSignSolanaMessage = async (
    nonce: string,
    selectedWallet?: SolanaWalletsEnum,
  ) => {
    if (!selectedWallet || !nonce) return;
    const provider = BlockchainUtils.getSolanaWalletsProvider(selectedWallet);

    try {
      const encodedMessage = new TextEncoder().encode(nonce);
      const signedMessage = await provider.signMessage(encodedMessage);

      const signature = signedMessage?.signature || '';

      return bs58.encode(signature);
    } catch (error) {
      console.log(error);

      return '';
    }
  };

  const handleDisconnectSol = async () => {
    localStorage.removeItem(AppConstant.SOLANA_PROVIDER);
  };

  const handleGetSolWalletAddress = async (
    selectedWallet?: SolanaWalletsEnum,
  ) => {
    const currentWalletProvider = localStorage.getItem(
      AppConstant.SOLANA_PROVIDER,
    ) as SolanaWalletsEnum;

    const provider = (selectedWallet ||
      currentWalletProvider) as SolanaWalletsEnum;

    if (!provider) return;

    const address = await handleConnectSolWallet(provider);

    if (!address) {
      handleDisconnectSol();
      return '';
    }

    return address;
  };

  return {
    handleDisconnectSol,
    handleSignSolanaMessage,
    handleGetSolWalletAddress,
  };
};

export default useSolanaAuthHooks;
