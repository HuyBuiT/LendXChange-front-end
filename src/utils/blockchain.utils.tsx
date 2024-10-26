import { SolanaWalletsEnum } from '@/models';
import { CoinStruct } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as splToken from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from 'spl-token-0.4.1';

export const getSolanaWalletsProvider = (solWallet: SolanaWalletsEnum) => {
  if (typeof window === undefined) return undefined;

  switch (solWallet) {
    case SolanaWalletsEnum.Backpack:
      return window.backpack;

    case SolanaWalletsEnum.Phantom:
      if (!window?.phantom) return undefined;
      return window.phantom.solana;

    case SolanaWalletsEnum.Solflare:
      return window.solflare;

    case SolanaWalletsEnum.Bitget:
      if (!window?.bitkeep) return undefined;
      return window.bitkeep.solana;

    case SolanaWalletsEnum.Salmon:
      if (!window?.salmon) return undefined;
      return window.salmon;

    default:
      return undefined;
  }
};

export const getSolanaRpcEndpoint = (): string => {
  if (process.env.RPC_URL) return process.env.RPC_URL;

  let mode = 'devnet';

  if (process.env.NETWORK_MODE === 'devnet') {
    mode = 'devnet';
  } else if (process.env.NETWORK_MODE === 'testnet') {
    mode = 'devnet';
  } else {
    mode = 'mainnet-beta';
  }

  return web3.clusterApiUrl(mode as web3.Cluster);
};

export const getEclipseRpcEndpoint = (): string => {
  return process.env.ECLIPSE_RPC_URL || '';
};

export const isValidSolMintAddress = async (mintAddress: string) => {
  try {
    const rpcUrl = getSolanaRpcEndpoint();
    const solanaConnection = new web3.Connection(rpcUrl, 'finalized');
    const mintPubKey = new web3.PublicKey(mintAddress);

    const info = await solanaConnection.getParsedAccountInfo(mintPubKey);

    if (!info) return false;

    const data = info.value?.data as any;

    if (!data) return false;
    return data?.parsed?.type;
  } catch (error) {
    return false;
  }
};

export const getSolanaNativeTokenBalance = async (
  walletAddress: string,
  rpcUrl: string,
) => {
  if (!walletAddress || !rpcUrl) return 0;

  try {
    const connection = new web3.Connection(rpcUrl, 'finalized');

    const address = new web3.PublicKey(walletAddress);
    const balance = await connection.getBalance(address);

    return balance / web3.LAMPORTS_PER_SOL;
  } catch (error) {
    return 0;
  }
};

export const getSolanaSplTokenBalance = async (
  walletAddress: string,
  tokenContractAddress: string,
  chain: 'solana' | 'eclipse',
) => {
  if (!walletAddress || !isValidSolMintAddress(tokenContractAddress)) return 0;

  try {
    const rpcUrl =
      chain === 'solana' ? getSolanaRpcEndpoint() : getEclipseRpcEndpoint();
    const connection = new web3.Connection(rpcUrl, 'finalized');

    const pubKey = new web3.PublicKey(walletAddress);
    const mintPubKey = new web3.PublicKey(tokenContractAddress);

    if (chain === 'solana') {
      const tokenAccount = await web3.PublicKey.findProgramAddressSync(
        [
          pubKey.toBuffer(),
          splToken.TOKEN_PROGRAM_ID.toBuffer(),
          mintPubKey.toBuffer(),
        ],
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const tokenAmountInfo = await connection.getTokenAccountBalance(
        tokenAccount[0] || tokenAccount,
        'confirmed',
      );
      const tokenAmount = tokenAmountInfo.value.uiAmount || 0;

      return tokenAmount;
    } else {
      const tokenAccount = await getAssociatedTokenAddressSync(
        mintPubKey,
        pubKey,
        true,
        TOKEN_2022_PROGRAM_ID,
      );

      const tokenAmountInfo = await connection.getTokenAccountBalance(
        tokenAccount,
        'confirmed',
      );

      const tokenAmount = tokenAmountInfo.value.uiAmount || 0;

      return tokenAmount;
    }
  } catch (error) {
    return 0;
  }
};

export const getAppropriateCoin = (
  tx: TransactionBlock,
  coins: CoinStruct[],
  amount: number,
): CoinStruct | null => {
  //Check if is there any coin has enough balance
  for (const coin of coins) {
    if (Number(coin.balance) >= amount) {
      return coin;
    }
  }
  return null;
};

export const mergeCoins = (
  tx: TransactionBlock,
  coins: CoinStruct[],
  amount: number,
): CoinStruct => {
  const mainCoin = coins[0];
  if (coins.length >= 2) {
    const secondaryCoins = coins.slice(1).map((coin) => coin);
    let mainCoinBalance = Number(mainCoin.balance);
    for (const coin of secondaryCoins) {
      tx.mergeCoins(mainCoin.coinObjectId, [coin.coinObjectId]);

      mainCoinBalance += Number(coin.balance);
      if (mainCoinBalance >= amount) {
        return mainCoin;
      }
    }
  }
  return mainCoin;
};
