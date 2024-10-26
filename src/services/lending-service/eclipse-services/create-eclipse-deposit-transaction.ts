import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { Program, web3, BN } from '@project-serum/anchor';
import { EclipseSupportedTokenEnum } from '@/models/app.model';
import { EnsoLending as EclipseEnsoLending } from './enso_lending';

import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from 'spl-token-0.4.1';

import {
  SolanaWalletsEnum,
  DepositCollateralTransactionInterface,
} from '@/models';

import eclipse_idl from './enso_lending.json';
const eclipse_idl_string = JSON.stringify(eclipse_idl);
const eclipse_idl_obj = JSON.parse(eclipse_idl_string);

export const createEclipseDepositTransaction = async (
  createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
) => {
  const { loanOfferId, tierId, amount, walletAddress, collateralAsset } =
    createDepositCollateralTransactionData;

  const collateralMintAssetPublicKey = new web3.PublicKey(
    collateralAsset.tokenAddress,
  );

  const currentWalletProvider = localStorage.getItem(
    AppConstant.SOLANA_PROVIDER,
  ) as SolanaWalletsEnum;

  const provider = BlockchainUtils.getSolanaWalletsProvider(
    currentWalletProvider,
  );

  if (!tierId || !loanOfferId || !walletAddress || !amount) return undefined;

  const programId = process.env.ECLIPSE_PROGRAM_ID || '';

  const program = new Program<EclipseEnsoLending>(
    eclipse_idl_obj,
    programId,
    provider,
  );

  const seedLoanOffer = [
    Buffer.from('enso'),
    Buffer.from('loan_offer'),
    new web3.PublicKey(walletAddress).toBuffer(),
    Buffer.from(loanOfferId),
    program.programId.toBuffer(),
  ];

  const loanOfferAccount = web3.PublicKey.findProgramAddressSync(
    seedLoanOffer,
    program.programId,
  )[0];

  const transaction = new web3.Transaction();

  let instruction: web3.TransactionInstruction;

  if (collateralAsset.symbol === EclipseSupportedTokenEnum.ETH) {
    instruction = await program.methods
      .depositCollateralLoanOfferNative(loanOfferId, tierId, new BN(amount))
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        loanOffer: loanOfferAccount,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
  } else {
    const borrowerAtaCollateralAsset = await getAssociatedTokenAddressSync(
      collateralMintAssetPublicKey,
      new web3.PublicKey(walletAddress),
      true,
      TOKEN_2022_PROGRAM_ID,
    );

    const seedVaultAuthority = [
      Buffer.from('enso'),
      new web3.PublicKey(walletAddress).toBuffer(),
      Buffer.from('vault_authority_loan_offer'),
      program.programId.toBuffer(),
    ];

    const vaultAuthorityAccount = web3.PublicKey.findProgramAddressSync(
      seedVaultAuthority,
      program.programId,
    )[0];

    const loanOfferCollateralAta = await getAssociatedTokenAddressSync(
      collateralMintAssetPublicKey,
      vaultAuthorityAccount,
      true,
      TOKEN_2022_PROGRAM_ID,
    );

    instruction = await program.methods
      .depositCollateralLoanOffer(loanOfferId, tierId, new BN(amount))
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        collateralMintAsset: collateralMintAssetPublicKey,
        borrowerAtaAsset: borrowerAtaCollateralAsset,
        loanOffer: loanOfferAccount,
        vaultAuthority: vaultAuthorityAccount,
        vault: loanOfferCollateralAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();
  }

  transaction.add(instruction);

  return transaction;
};
