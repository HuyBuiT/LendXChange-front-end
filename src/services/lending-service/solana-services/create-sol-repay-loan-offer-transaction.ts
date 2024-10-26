import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { Program, web3 } from '@project-serum/anchor';
import { EnsoLending as SolanaEnsoLending } from './enso_lending';

import {
  SolanaWalletsEnum,
  SolanaSupportedTokenEnum,
  RepayLoanOfferTransactionInterface,
} from '@/models';

import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import solana_idl from './enso_lending.json';
const solana_idl_string = JSON.stringify(solana_idl);
const solana_idl_obj = JSON.parse(solana_idl_string);

export const createSolRepayLoanOfferTransaction = async (
  createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
) => {
  const { tierId, loanOfferId, walletAddress, collateralAsset, lendAsset } =
    createRepayLoanOfferTransactionData;

  const collateralMintAssetPublicKey = new web3.PublicKey(
    collateralAsset.tokenAddress,
  );
  const lendMintAssetPublicKey = new web3.PublicKey(lendAsset.tokenAddress);

  const currentWalletProvider = localStorage.getItem(
    AppConstant.SOLANA_PROVIDER,
  ) as SolanaWalletsEnum;

  const provider = BlockchainUtils.getSolanaWalletsProvider(
    currentWalletProvider,
  );

  if (!tierId || !loanOfferId || !walletAddress) return undefined;

  const programId = process.env.SOL_PROGRAM_ID || '';
  const hotWalletAddress = process.env.SOL_HOT_WALLET || '';

  const program = new Program<SolanaEnsoLending>(
    solana_idl_obj,
    programId,
    provider,
  );

  const hotWalletUsdcAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    lendMintAssetPublicKey,
    new web3.PublicKey(hotWalletAddress),
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

  const borrowerUsdcAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    lendMintAssetPublicKey,
    new web3.PublicKey(walletAddress),
  );

  const transaction = new web3.Transaction();

  let instruction: web3.TransactionInstruction;

  if (collateralAsset.symbol === SolanaSupportedTokenEnum.SOL) {
    instruction = await program.methods
      .repayLoanOfferNative(loanOfferId)
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        lendMintAsset: lendMintAssetPublicKey,
        borrowerAtaLendAsset: borrowerUsdcAta,
        loanOffer: loanOfferAccount,
        hotWalletAtaLendAsset: hotWalletUsdcAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
  } else {
    const borrowerAtaCollateralAsset = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      collateralMintAssetPublicKey,
      new web3.PublicKey(walletAddress),
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

    const loanOfferCollateralAta = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      collateralMintAssetPublicKey,
      vaultAuthorityAccount,
      true,
    );

    instruction = await program.methods
      .repayLoanOffer(loanOfferId)
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        lendMintAsset: lendMintAssetPublicKey,
        collateralMintAsset: collateralMintAssetPublicKey,
        borrowerAtaLendAsset: borrowerUsdcAta,
        borrowerAtaCollateralAsset: borrowerAtaCollateralAsset,
        loanOffer: loanOfferAccount,
        vaultAuthority: vaultAuthorityAccount,
        vault: loanOfferCollateralAta,
        hotWalletAtaLendAsset: hotWalletUsdcAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();
  }

  transaction.add(instruction);

  return transaction;
};
