import { AppConstant } from '@/const';
import { AppService } from '@/services';
import { SolanaWalletsEnum, SupportedChainEnum } from '@/models';

import Cookies from 'js-cookie';
import useSuiAuthHook from './sui-auth-hooks';
import useSolanaAuthHooks from './solana-auth-hooks';
import useMovementAptosAuthHook from './aptos-movement-auth-hooks';

const useAuthHook = () => {
  const { handleSignSuiMessage, handleDisconnectSui } = useSuiAuthHook();
  const { handleSignSolanaMessage, handleDisconnectSol } = useSolanaAuthHooks();
  const { handleSignMovementAptosMessage, handleDisconnectMovementAptos } =
    useMovementAptosAuthHook();

  const handleGetWalletNonce = async (walletAddress: string) => {
    if (!walletAddress) return '';

    const responseData = await AppService.getNonceService(walletAddress);

    return responseData?.nonce || '';
  };

  const handleGetAccessToken = async (
    address: string,
    signature: string,
    SelectChainButton: SupportedChainEnum,
    walletType?: string,
  ) => {
    if (!address || !signature) return '';

    const { accessToken } = await AppService.postLoginService({
      network: SelectChainButton,
      walletAddress: address,
      walletType,
      signature,
    });

    return accessToken;
  };

  const handleLogin = async (
    walletAddress: string,
    selectedChain: SupportedChainEnum,
    walletType?: string,
    publicKey?: string,
  ) => {
    const cloneWalletAddress =
      selectedChain === SupportedChainEnum.AptosMovement
        ? publicKey
        : walletAddress;

    if (!cloneWalletAddress || !walletAddress) {
      handleLogout(selectedChain);
      return;
    }

    const accessToken = Cookies.get(AppConstant.KEY_TOKEN);

    if (accessToken) return walletAddress;

    const nonce = await handleGetWalletNonce(walletAddress);

    let signature;

    if (
      selectedChain === SupportedChainEnum.Solana ||
      selectedChain === SupportedChainEnum.Eclipse
    ) {
      const selectedWallet = walletType as SolanaWalletsEnum;
      signature = await handleSignSolanaMessage(nonce, selectedWallet);
    } else if (selectedChain === SupportedChainEnum.Sui) {
      signature = await handleSignSuiMessage(nonce);
    } else if (selectedChain === SupportedChainEnum.AptosMovement) {
      signature = await handleSignMovementAptosMessage(nonce);
    }

    if (!signature) {
      handleLogout(selectedChain);
      return '';
    }

    const newAccessToken = await handleGetAccessToken(
      cloneWalletAddress,
      signature,
      selectedChain,
      walletType,
    );

    if (newAccessToken) {
      Cookies.set(AppConstant.KEY_TOKEN, newAccessToken);
      return walletAddress;
    } else {
      handleLogout(selectedChain);
      return '';
    }
  };

  const handleLogout = async (selectedChain: SupportedChainEnum) => {
    const accessToken = Cookies.get(AppConstant.KEY_TOKEN);

    if (accessToken) {
      await AppService.postLogout();
      Cookies.remove(AppConstant.KEY_TOKEN);
    }

    if (selectedChain === SupportedChainEnum.Solana) {
      await handleDisconnectSol();
    } else if (selectedChain === SupportedChainEnum.Sui) {
      await handleDisconnectSui();
    } else if (selectedChain === SupportedChainEnum.AptosMovement) {
      await handleDisconnectMovementAptos();
    }
  };

  return {
    handleLogin,
    handleLogout,
  };
};

export default useAuthHook;
