import { AppConstant } from '@/const';
import { BlockchainUtils } from '@/utils';
import { Program, web3 } from '@project-serum/anchor';
import { EnsoLending as EclipseEnsoLending } from './enso_lending';
import { SolanaWalletsEnum, CancelLendTransactionInterface } from '@/models';

import eclipse_idl from './enso_lending.json';
const eclipse_idl_string = JSON.stringify(eclipse_idl);
const eclipse_idl_obj = JSON.parse(eclipse_idl_string);

export const createEclipseCancelLendTransaction = async (
  createCancelLendTransactionData: CancelLendTransactionInterface,
) => {
  const { walletAddress, offerId } = createCancelLendTransactionData;

  const programId = process.env.ECLIPSE_PROGRAM_ID || '';

  const currentWalletProvider = localStorage.getItem(
    AppConstant.SOLANA_PROVIDER,
  ) as SolanaWalletsEnum;

  const provider = BlockchainUtils.getSolanaWalletsProvider(
    currentWalletProvider,
  );

  if (!walletAddress || !offerId || !programId || !provider) return undefined;

  const program = new Program<EclipseEnsoLending>(
    eclipse_idl_obj,
    programId,
    provider,
  );

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

  const transaction = new web3.Transaction();

  const instruction = await program.methods
    .cancelLendOffer(offerId)
    .accounts({
      lender: new web3.PublicKey(walletAddress),
      lendOffer: lendOfferAccount,
    })
    .instruction();

  return transaction.add(instruction);
};
