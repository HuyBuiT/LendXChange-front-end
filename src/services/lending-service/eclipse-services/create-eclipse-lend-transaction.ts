import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { Program, web3 } from '@project-serum/anchor';
import { EnsoLending as EclipseEnsoLending } from './enso_lending';
import { SolanaWalletsEnum, CreateLendTransactionInterface } from '@/models';

import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from 'spl-token-0.4.1';

import eclipse_idl from './enso_lending.json';
const eclipse_idl_string = JSON.stringify(eclipse_idl);
const eclipse_idl_obj = JSON.parse(eclipse_idl_string);

export const createEclipseLendTransaction = async (
  createLendTransactionsData: CreateLendTransactionInterface,
) => {
  const { walletAddress, interest, tierId, numberOfOffer, lendAsset } =
    createLendTransactionsData;

  const programId = process.env.ECLIPSE_PROGRAM_ID || '';

  const hotWalletAddress = process.env.ECLIPSE_HOT_WALLET || '';

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

  const hotWalletUsdcAta = await getAssociatedTokenAddressSync(
    lendMintAssetPublicKey,
    new web3.PublicKey(hotWalletAddress),
    true,
    TOKEN_2022_PROGRAM_ID,
  );

  const lenderUsdcAta = await getAssociatedTokenAddressSync(
    lendMintAssetPublicKey,
    new web3.PublicKey(walletAddress),
    true,
    TOKEN_2022_PROGRAM_ID,
  );

  const program = new Program<EclipseEnsoLending>(
    eclipse_idl_obj,
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
          hotWalletAta: hotWalletUsdcAta,
          lender: new web3.PublicKey(walletAddress),
          lenderAtaAsset: lenderUsdcAta,
          lendOffer: lendOfferAccount,
          mintAsset: lendMintAssetPublicKey,
          settingAccount: settingAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          lendAsset,
        })
        .instruction();

      tx.add(instruction);
      totalInstructions++;
    }
    transactions.push(tx);
  }

  return transactions;
};
