import { CommonUtils } from '@/utils';
import { ApiResponse } from 'apisauce';
import { ApiConstant, AppConstant } from '@/const';
import { createCheckNftApi, createDappServices } from '../config';

import {
  BaseResponseData,
  SupportedChainEnum,
  BestOfferItemViewInterface,
  BestOfferListResponseInterface,
  ActiveLoanListResponseInterface,
  OfferTemplatesApiResponseInterface,
} from '@/models';

export const getOfferTemplatesService = async (
  selectedChain: SupportedChainEnum,
) => {
  const params = {
    sorts: {
      'offerTemplate.amount': 'ASC',
    },
  };

  const response: ApiResponse<
    BaseResponseData<OfferTemplatesApiResponseInterface>
  > = await createDappServices().get(ApiConstant.GET_OFFER_TEMPLATES, params);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as OfferTemplatesApiResponseInterface;
  } else {
    return undefined;
  }
};

export const getInterestNavi = async () => {
  try {
    const response = await fetch(ApiConstant.NAVI_PROTOCOL_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      return undefined;
    }

    return await response.json();
  } catch (err) {
    console.log(err);

    return undefined;
  }
};

export const getBestOffersDashboard = async (
  templateId: string,
  selectedChain: SupportedChainEnum,
) => {
  const params = {
    network: selectedChain,
    templateId: templateId,
    pageSize: AppConstant.DISPLAY_ACTIVE_LOAN_BEST_OFFER,
    pageNum: 1,
    sorts: {
      'offer.interestRate': 'ASC',
    },
  };
  const apiUrl = ApiConstant.GET_BEST_OFFERS;

  const response: ApiResponse<BaseResponseData<BestOfferItemViewInterface>> =
    await createDappServices().get(apiUrl, params);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as BestOfferListResponseInterface;
  } else {
    return undefined;
  }
};

export const getLoansByTemplateId = async (
  templateId: string,
  selectedChain: SupportedChainEnum,
) => {
  const params = {
    network: selectedChain,
    templateId: templateId,
    pageSize: AppConstant.DISPLAY_ACTIVE_LOAN_BEST_OFFER,
    pageNum: 1,
    sorts: {
      'loan.createdAt': 'DESC',
    },
  };
  const apiUrl = ApiConstant.GET_ACTIVE_LOANS;

  const response: ApiResponse<
    BaseResponseData<ActiveLoanListResponseInterface>
  > = await createDappServices().get(apiUrl, params);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as ActiveLoanListResponseInterface;
  } else {
    return undefined;
  }
};

export const getAssetsByOwner = async (
  walletAddress: string,
  pageNum: number,
) => {
  const url = ApiConstant.CHECK_NFT_SOURCE;
  const response: ApiResponse<any> = await createCheckNftApi().post(url, {
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: walletAddress,
      page: pageNum,
    },
    id: 'my-id',
    jsonrpc: '2.0',
  });

  if (!response.status) return undefined;

  if (response.status >= 200 && response.status < 300) {
    return response.data.result;
  }
};

// Cross chain

// export const suiConfirmCollateralTransaction = async (
//   data: ConfirmCollateralTransactionInterface,
// ) => {
//   console.log(data);

//   // if (!data.collateralAmount) return;
//   // const { collateralAmount, lendOfferId, targetChain, targetAddress, tierId } =
//   //   data;
//   // const target =
//   //   `${process.env.SUI_MOVEMENT_PACKAGE}::loan_crosschain::confirm_collateral_crosschain_test` as MoveCallTargetType;

//   // const version = process.env.SUI_MOVEMENT_VERSION || '';
//   // const emitterCap = process.env.WORMHOLE_EMITTER_CAP || '';
//   // const wormholeState = process.env.WORMHOLE_STATE || '';
//   // const collateralType = process.env.SUI_MOVEMENT_COLLATERAL_COIN_TYPE || '';
//   // const collateralMetadata = process.env.SUI_METADATA || '';

//   // const tx = new TransactionBlock();

//   // const [splitCoinAmount] = tx.splitCoins(tx.gas, [
//   //   tx.pure(Math.floor(collateralAmount)),
//   // ]);

//   // const result = tx.moveCall({
//   //   target: target,
//   //   typeArguments: [collateralType],
//   //   arguments: [
//   //     tx.object(version),
//   //     tx.object(emitterCap),
//   //     tx.object(wormholeState),
//   //     tx.object(collateralMetadata),
//   //     splitCoinAmount,
//   //     tx.pure.u64(targetChain),
//   //     tx.pure(targetAddress),
//   //     tx.pure(tierId),
//   //     tx.pure(lendOfferId),
//   //     tx.pure('symbol.SUI/USDC'),
//   //     tx.object('0x6'),
//   //   ],
//   // });
//   // console.log('result', result);

//   const tx = new TransactionBlock();

//   return tx;
// };

// export interface ConfirmCollateralTransactionInterface {
//   collateralAmount: number;
//   lendOfferId: string;
//   tierId: string;
//   targetChain: number;
//   targetAddress: string;
//   walletAddress: string;
// }

// export const solCreateBorrowCrossChainTransaction = async (
//   data: SolBorrowCrossChainTransactionInterface,
// ) => {
//   console.log(data);

//   // const programId = process.env.SOL_PROGRAM_ID || '';
//   // const wormholeProgramId = process.env.WORMHOLE_PROGRAM_ID || '';

//   // const currentWalletProvider = localStorage.getItem(
//   //   AppConstant.SOLANA_PROVIDER,
//   // ) as SolanaWalletsEnum;

//   // const provider = BlockchainUtils.getSolanaWalletsProvider(
//   //   currentWalletProvider,
//   // );

//   // if (!provider) return undefined;

//   // const program = new Program<EnsoLending>(idl_obj, programId, provider);

//   // // const seedSettingAccount = [
//   // //   Buffer.from("enso"),
//   // //   Buffer.from("setting_account"),
//   // //   Buffer.from("tier_005"),
//   // //   new web3.PublicKey(programId).toBuffer(),
//   // // ];

//   // // const settingAccount = web3.PublicKey.findProgramAddressSync(
//   // //   seedSettingAccount,
//   // //   new web3.PublicKey(programId)
//   // // )[0];

//   // const timestamp = new Date().getTime();

//   // const borrowOfferId = `borrow_offer_${walletAddress.substring(
//   //   walletAddress.length - 4,
//   // )}_${timestamp}`;

//   // const seedLoanOffer = [
//   //   Buffer.from('enso'),
//   //   Buffer.from('loan_offer'),
//   //   new web3.PublicKey(walletAddress).toBuffer(),
//   //   Buffer.from(borrowOfferId),
//   //   program.programId.toBuffer(),
//   // ];

//   // const loanOfferAccount = web3.PublicKey.findProgramAddressSync(
//   //   seedLoanOffer,
//   //   program.programId,
//   // )[0];

//   // const seedLendOffer = [
//   //   Buffer.from('enso'),
//   //   Buffer.from('lend_offer'),
//   //   new web3.PublicKey(lenderAddress).toBuffer(),
//   //   Buffer.from('lend_offer_001'),
//   //   program.programId.toBuffer(),
//   // ];

//   // const lendOfferAccount = web3.PublicKey.findProgramAddressSync(
//   //   seedLendOffer,
//   //   program.programId,
//   // )[0];

//   // const transaction = new web3.Transaction();
//   // const vaa = new Uint8Array(vaaHash);

//   // const instruction = await program.methods
//   //   .createLoanOfferCrossChain(
//   //     tierId,
//   //     borrowOfferId,
//   //     lendOfferId,
//   //     Array.from(vaa),
//   //   )
//   //   .accounts({
//   //     systemWormhole: new web3.PublicKey(
//   //       'a23QvEb6Q3adWurmUVbJ9YfAa6tiEzZBdXB8cvmhViS',
//   //     ),
//   //     lendMintAsset: new web3.PublicKey(
//   //       CommonUtils.getSolEnvByToken(
//   //         SolanaSupportedTokenEnum.USDC,
//   //         process.env.SOLANA_TOKENS_ADDRESS,
//   //       ),
//   //     ),
//   //     loanOffer: loanOfferAccount,
//   //     lender: new web3.PublicKey(lenderAddress),
//   //     borrower: new web3.PublicKey(walletAddress),
//   //     lendOffer: lendOfferAccount,
//   //     lendPriceFeedAccount: new web3.PublicKey(
//   //       CommonUtils.getSolEnvByToken(
//   //         SolanaSupportedTokenEnum.USDC,
//   //         process.env.SOLANA_CONTRACT_PRICE_FEED_IDS,
//   //       ),
//   //     ),
//   //     collateralPriceFeedAccount: new web3.PublicKey(
//   //       CommonUtils.getSolEnvByToken(
//   //         SolanaSupportedTokenEnum.SOL,
//   //         process.env.SOLANA_CONTRACT_PRICE_FEED_IDS,
//   //       ),
//   //     ),
//   //     settingAccount: new PublicKey(
//   //       'CGuGLPCPsddpKyANxrBNTc4bgVRFdG3eRUf6tbPYgB2o',
//   //     ),
//   //     posted: postedVaa,
//   //     wormholeProgram: new PublicKey(wormholeProgramId),
//   //     systemProgram: web3.SystemProgram.programId,
//   //   })
//   //   .instruction();

//   // transaction.add(instruction);

//   const transaction = new web3.Transaction();
//   return transaction;
// };

// export interface SolBorrowCrossChainTransactionInterface {
//   collateralAmount: number;
//   walletAddress: string;
//   lenderAddress: string;
//   lendOfferId: string;
//   tierId: string;
//   postedVaa: web3.PublicKey;
//   vaaHash: Buffer;
// }
