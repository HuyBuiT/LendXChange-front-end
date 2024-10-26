import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { TransactionInstruction } from '@solana/web3.js';
import { Program, web3, BN } from '@project-serum/anchor';
import { EnsoLending as SolanaEnsoLending } from './enso_lending';

import {
  SolanaWalletsEnum,
  SolanaSupportedTokenEnum,
  BorrowTransactionInterface,
} from '@/models';

import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import solana_idl from './enso_lending.json';
const solana_idl_string = JSON.stringify(solana_idl);
const solana_idl_obj = JSON.parse(solana_idl_string);
import * as splToken from '@solana/spl-token';

export const createSolBorrowTransaction = async (
  createBorrowTransactionData: BorrowTransactionInterface,
) => {
  const {
    collateralAsset,
    lendAsset,
    collateralAmount,
    interest,
    walletAddress,
    lenderAddress,
    lendOfferId,
    tierId,
  } = createBorrowTransactionData;

  const programId = process.env.SOL_PROGRAM_ID || '';

  const lendMintAssetPublicKey = new web3.PublicKey(lendAsset.tokenAddress);

  const collateralMintAssetPublicKey = new web3.PublicKey(
    collateralAsset.tokenAddress,
  );

  const lendPriceFeedPublicKey = new web3.PublicKey(
    lendAsset.priceFeedAccountAddress,
  );

  const collateralPriceFeedPublicKey = new web3.PublicKey(
    collateralAsset.priceFeedAccountAddress,
  );

  const currentWalletProvider = localStorage.getItem(
    AppConstant.SOLANA_PROVIDER,
  ) as SolanaWalletsEnum;

  const provider = BlockchainUtils.getSolanaWalletsProvider(
    currentWalletProvider,
  );

  if (!provider) throw Error('No provider was found!');

  const program = new Program<SolanaEnsoLending>(
    solana_idl_obj,
    programId,
    provider,
  );

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

  const timestamp = new Date().getTime();

  const borrowOfferId = `borrow_offer_${walletAddress.substring(
    walletAddress.length - 4,
  )}_${timestamp}`;

  const seedLoanOffer = [
    Buffer.from('enso'),
    Buffer.from('loan_offer'),
    new web3.PublicKey(walletAddress).toBuffer(),
    Buffer.from(borrowOfferId),
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

  const seedLendOffer = [
    Buffer.from('enso'),
    Buffer.from('lend_offer'),
    new web3.PublicKey(lenderAddress).toBuffer(),
    Buffer.from(lendOfferId),
    program.programId.toBuffer(),
  ];

  const lendOfferAccount = web3.PublicKey.findProgramAddressSync(
    seedLendOffer,
    program.programId,
  )[0];

  const transaction = new web3.Transaction();

  let instruction: TransactionInstruction;

  if (collateralAsset.symbol === SolanaSupportedTokenEnum.SOL) {
    instruction = await program.methods
      .createLoanOfferNative(
        borrowOfferId,
        lendOfferId,
        tierId,
        new BN(collateralAmount),
        interest,
      )
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        collateralMintAsset: collateralMintAssetPublicKey,
        lendMintAsset: lendMintAssetPublicKey,
        lendAsset: lendMintAsset,
        collateralAsset: collateralMintAsset,
        loanOffer: loanOfferAccount,
        lender: new web3.PublicKey(lenderAddress),
        lendOffer: lendOfferAccount,
        lendPriceFeedAccount: lendPriceFeedPublicKey,
        collateralPriceFeedAccount: collateralPriceFeedPublicKey,
        settingAccount: settingAccount,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
  } else {
    const borrowerCollateralAtaAsset = await Token.getAssociatedTokenAddress(
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
      .createLoanOffer(
        borrowOfferId,
        lendOfferId,
        tierId,
        new BN(collateralAmount),
        interest,
      )
      .accounts({
        borrower: new web3.PublicKey(walletAddress),
        collateralMintAsset: collateralMintAssetPublicKey,
        lendMintAsset: lendMintAssetPublicKey,
        borrowerAtaAsset: borrowerCollateralAtaAsset,
        lendAsset: lendMintAsset,
        collateralAsset: collateralMintAsset,
        loanOffer: loanOfferAccount,
        lendOffer: lendOfferAccount,
        vaultAuthority: vaultAuthorityAccount,
        vault: loanOfferCollateralAta,
        lender: new web3.PublicKey(lenderAddress),
        lendPriceFeedAccount: lendPriceFeedPublicKey,
        collateralPriceFeedAccount: collateralPriceFeedPublicKey,
        settingAccount: settingAccount,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
  }

  transaction.add(instruction);

  return transaction;
};
