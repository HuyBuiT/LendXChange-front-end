import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  AccountLayout,
} from '@solana/spl-token';
import * as web3 from '@solana/web3.js';

export const getAssociatedTokenAddress = async (
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): Promise<web3.PublicKey> => {
  if (!allowOwnerOffCurve && !web3.PublicKey.isOnCurve(owner.toBuffer()))
    throw new Error('TokenOwnerOffCurveError');

  const [address] = await web3.PublicKey.findProgramAddress(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId,
  );

  return address;
};

export const getOrCreateAssociatedTokenAccount = async (
  connection: web3.Connection,
  payer: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  provider: any, // current wallet provider
  allowOwnerOffCurve = false,
  commitment?: web3.Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
) => {
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId,
  );

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account;
  try {
    account = await getAccountInfo(
      connection,
      associatedToken,
      commitment,
      programId,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (
      error.message === 'TokenAccountNotFoundError' ||
      error.message === 'TokenInvalidAccountOwnerError'
    ) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        const transaction = new web3.Transaction().add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId,
          ),
        );

        const blockHash = await connection.getRecentBlockhash();
        transaction.feePayer = await payer;
        transaction.recentBlockhash = await blockHash.blockhash;
        const signed = await provider.signTransaction(transaction);

        const signature = await connection.sendRawTransaction(
          signed.serialize(),
        );

        await connection.confirmTransaction(signature);
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }

      // Now this should always succeed
      account = await getAccountInfo(
        connection,
        associatedToken,
        commitment,
        programId,
      );
    } else {
      throw error;
    }
  }

  if (!account.mint.equals(mint)) throw Error('TokenInvalidMintError');
  if (!account.owner.equals(owner)) throw new Error('TokenInvalidOwnerError');

  return account;
};

export const getAccountInfo = async (
  connection: web3.Connection,
  address: web3.PublicKey,
  commitment?: web3.Commitment,
  programId = TOKEN_PROGRAM_ID,
) => {
  const info = await connection.getAccountInfo(address, commitment);
  if (!info) throw new Error('TokenAccountNotFoundError');
  if (!info.owner.equals(programId))
    throw new Error('TokenInvalidAccountOwnerError');
  if (info.data.length != AccountLayout.span)
    throw new Error('TokenInvalidAccountSizeError');

  const rawAccount = AccountLayout.decode(Buffer.from(info.data));

  console.log(rawAccount, 'rawAccount');

  return {
    address,
    mint: rawAccount.mint,
    owner: rawAccount.owner,
    amount: rawAccount.amount,
    delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
    delegatedAmount: rawAccount.delegatedAmount,
    isInitialized: true, // TODO rawAccount.state !==  splToken.AccountState.Uninitialized,
    isFrozen: false, // TODO rawAccount.state === splToken.AccountState.Frozen,
    isNative: !!rawAccount.isNativeOption,
    rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
    closeAuthority: rawAccount.closeAuthorityOption
      ? rawAccount.closeAuthority
      : null,
  };
};

export const createAssociatedTokenAccountInstruction = (
  payer: web3.PublicKey,
  associatedToken: web3.PublicKey,
  owner: web3.PublicKey,
  mint: web3.PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): web3.TransactionInstruction => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new web3.TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  });
};
