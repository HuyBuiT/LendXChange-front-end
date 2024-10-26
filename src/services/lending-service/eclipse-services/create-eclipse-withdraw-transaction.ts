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
  WithdrawCollateralTransactionInterface,
} from '@/models';

import eclipse_idl from './enso_lending.json';
const eclipse_idl_string = JSON.stringify(eclipse_idl);
const eclipse_idl_obj = JSON.parse(eclipse_idl_string);

export const createEclipseWithdrawTransaction = async (
  createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
) => {
  const {
    loanOfferId,
    tierId,
    amount,
    walletAddress,
    collateralAsset,
    lendAsset,
  } = createWithdrawCollateralTransactionData;

  const lendMintAssetPublicKey = new web3.PublicKey(lendAsset.tokenAddress);

  const collateralMintAssetPublicKey = new web3.PublicKey(
    collateralAsset.tokenAddress,
  );

  const lendPriceFeedAccountPublicKey = new web3.PublicKey(
    lendAsset.priceFeedAccountAddress,
  );

  const collateralPriceFeedAccountPublicKey = new web3.PublicKey(
    collateralAsset.priceFeedAccountAddress,
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

  const seedLendAsset = [
    Buffer.from('enso'),
    Buffer.from('asset'),
    lendMintAssetPublicKey.toBuffer(),
    program.programId.toBuffer(),
  ];
  const lendMintAsset = web3.PublicKey.findProgramAddressSync(
    seedLendAsset,
    program.programId,
  )[0];

  const seedCollateralAsset = [
    Buffer.from('enso'),
    Buffer.from('asset'),
    collateralMintAssetPublicKey.toBuffer(),
    program.programId.toBuffer(),
  ];
  const collateralMintAsset = web3.PublicKey.findProgramAddressSync(
    seedCollateralAsset,
    program.programId,
  )[0];

  const transaction = new web3.Transaction();

  let instruction: web3.TransactionInstruction;

  if (collateralAsset.symbol === EclipseSupportedTokenEnum.ETH) {
    instruction = await program.methods
      .withdrawCollateralLoanOfferNative(loanOfferId, new BN(amount))
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        collateralMintAsset: collateralMintAssetPublicKey,
        lendMintAsset: lendMintAssetPublicKey,
        lendAsset: lendMintAsset,
        collateralAsset: collateralMintAsset,
        loanOffer: loanOfferAccount,
        lendPriceFeedAccount: lendPriceFeedAccountPublicKey,
        collateralPriceFeedAccount: collateralPriceFeedAccountPublicKey,
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
      .withdrawCollateralLoanOffer(loanOfferId, new BN(amount))
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        collateralMintAsset: collateralMintAssetPublicKey,
        lendMintAsset: lendMintAssetPublicKey,
        lendAsset: lendMintAsset,
        collateralAsset: collateralMintAsset,
        borrowerAtaCollateralAsset,
        loanOffer: loanOfferAccount,
        vaultAuthority: vaultAuthorityAccount,
        vault: loanOfferCollateralAta,
        lendPriceFeedAccount: lendPriceFeedAccountPublicKey,
        collateralPriceFeedAccount: collateralPriceFeedAccountPublicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();
  }

  transaction.add(instruction);

  return transaction;
};
