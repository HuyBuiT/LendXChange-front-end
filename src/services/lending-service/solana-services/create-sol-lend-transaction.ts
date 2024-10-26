import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { Program, web3 } from '@project-serum/anchor';
import { EnsoLending as SolanaEnsoLending } from './enso_lending';
import { SolanaWalletsEnum, CreateLendTransactionInterface } from '@/models';

import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import solana_idl from './enso_lending.json';
const solana_idl_string = JSON.stringify(solana_idl);
const solana_idl_obj = JSON.parse(solana_idl_string);
import * as splToken from '@solana/spl-token';

export const createSolLendTransaction = async (
  createLendTransactionsData: CreateLendTransactionInterface,
) => {
  const { walletAddress, interest, tierId, numberOfOffer, lendAsset } =
    createLendTransactionsData;

  const programId = process.env.SOL_PROGRAM_ID || '';

  const hotWalletAddress = process.env.SOL_HOT_WALLET || '';

  const currentWalletProvider = localStorage.getItem(
    AppConstant.SOLANA_PROVIDER,
  ) as SolanaWalletsEnum;

  const provider = BlockchainUtils.getSolanaWalletsProvider(
    currentWalletProvider,
  );

  if (!walletAddress || !programId) return undefined;

  const lendMintAssetPublicKey = new web3.PublicKey(lendAsset.tokenAddress);

  const seedSettingAccount = [
    Buffer.from('enso'),
    Buffer.from('setting_account'),
    Buffer.from(tierId),
    new web3.PublicKey(programId).toBuffer(),
  ];

  const settingAccount = web3.PublicKey.findProgramAddressSync(
    seedSettingAccount,
    new web3.PublicKey(programId),
  )[0];

  const hotWalletUsdcAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    lendMintAssetPublicKey,
    new web3.PublicKey(hotWalletAddress),
  );

  const lenderUsdcAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    lendMintAssetPublicKey,
    new web3.PublicKey(walletAddress),
  );

  const program = new Program<SolanaEnsoLending>(
    solana_idl_obj,
    programId,
    provider,
  );

  const transactions = [];
  const maxInstructionPerTransaction = 5;
  let totalInstructions = 0;
  const timestamp = new Date().getTime();
  while (totalInstructions < numberOfOffer) {
    const tx = new web3.Transaction();
    const maxIntructions = Math.min(
      maxInstructionPerTransaction,
      numberOfOffer - totalInstructions,
    );
    for (let i = 0; i < maxIntructions; i++) {
      const offerId = `lend_offer_${walletAddress.substring(
        walletAddress.length - 7,
      )}_${timestamp + totalInstructions}`;

      const seedLendOffer = [
        Buffer.from('enso'),
        Buffer.from('lend_offer'),
        new web3.PublicKey(walletAddress).toBuffer(),
        Buffer.from(offerId),
        new web3.PublicKey(programId).toBuffer(),
      ];

      const lendOfferAccount = web3.PublicKey.findProgramAddressSync(
        seedLendOffer,
        new web3.PublicKey(programId),
      )[0];

      const seedLendAsset = [
        Buffer.from('enso'),
        Buffer.from('asset'),
        lendMintAssetPublicKey.toBuffer(),
        program.programId.toBuffer(),
      ];
      const lendAsset = web3.PublicKey.findProgramAddressSync(
        seedLendAsset,
        program.programId,
      )[0];

      const instruction = await program.methods
        .createLendOffer(offerId, tierId, interest)
        .accounts({
          lender: new web3.PublicKey(walletAddress),
          lendAsset,
          mintAsset: lendMintAssetPublicKey,
          lenderAtaAsset: lenderUsdcAta,
          settingAccount: settingAccount,
          lendOffer: lendOfferAccount,
          hotWalletAta: hotWalletUsdcAta,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
        })
        .instruction();

      tx.add(instruction);
      totalInstructions++;
    }
    transactions.push(tx);
  }

  return transactions;
};
