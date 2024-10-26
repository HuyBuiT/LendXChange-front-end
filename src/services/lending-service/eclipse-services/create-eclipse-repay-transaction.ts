import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, web3 } from '@project-serum/anchor';
import { EclipseSupportedTokenEnum } from '@/models/app.model';
import { EnsoLending as EclipseEnsoLending } from './enso_lending';

import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from 'spl-token-0.4.1';

import {
  SolanaWalletsEnum,
  RepayLoanOfferTransactionInterface,
} from '@/models';

import eclipse_idl from './enso_lending.json';
const eclipse_idl_string = JSON.stringify(eclipse_idl);
const eclipse_idl_obj = JSON.parse(eclipse_idl_string);

export const createEclipseRepayTransaction = async (
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

  const programId = process.env.ECLIPSE_PROGRAM_ID || '';
  const hotWalletAddress = process.env.ECLIPSE_HOT_WALLET || '';

  const program = new Program<EclipseEnsoLending>(
    eclipse_idl_obj,
    programId,
    provider,
  );

  const hotWalletUsdcAta = await getAssociatedTokenAddressSync(
    lendMintAssetPublicKey,
    new web3.PublicKey(hotWalletAddress),
    true,
    TOKEN_2022_PROGRAM_ID,
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

  const borrowerUsdcAta = await getAssociatedTokenAddressSync(
    lendMintAssetPublicKey,
    new web3.PublicKey(walletAddress),
    true,
    TOKEN_2022_PROGRAM_ID,
  );

  const transaction = new web3.Transaction();

  let instruction: web3.TransactionInstruction;

  if (collateralAsset.symbol === EclipseSupportedTokenEnum.ETH) {
    instruction = await program.methods
      .repayLoanOfferNative(loanOfferId)
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        lendMintAsset: lendMintAssetPublicKey,
        borrowerAtaLendAsset: borrowerUsdcAta,
        loanOffer: loanOfferAccount,
        hotWalletAtaLendAsset: hotWalletUsdcAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
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
      TOKEN_PROGRAM_ID,
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
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();
  }

  transaction.add(instruction);

  return transaction;
};
