import {
  LoanStatus,
  SupportTokenType,
  SupportedChainEnum,
  ContractResponseInterface,
  LoanContractViewInterface,
} from '@/models';
import { CommonUtils, DateUtils } from '@/utils';
import { Asset, EventName, SuiSupportedTokenEnum, SupportedTokenSuiIndexEnum } from '@/models/app.model';

export const refactorContractList = (
  data: ContractResponseInterface[],
  availableAssets: Map<SupportTokenType, Asset>,
) => {
  if (!data.length) return [];

  console.log('data', data);
  const refactorData = data.map((item) => {
    const decimal = 6;
    const collateralsDecimal = 9;

    const duration = DateUtils.convertSecondsToDayHourMinute(
      new Date(item.endDate).getTime() / 1000 -
        new Date(item.startDate).getTime() / 1000,
    ).day;

    const amount = item.amount / Math.pow(10, decimal);

    const borrowInterestValue = getDecimalAmount(
            CommonUtils.calculateInterestValue(
              amount,
              item.interestRate,
              duration,
              1,
            ),
            SupportedChainEnum.Sui,
            SuiSupportedTokenEnum.USDC,
          );

    console.log('borrowValue', borrowInterestValue);
    const collateral = {
      amount: item.collaterals[0]?.amount
        ? item.collaterals[0].amount / Math.pow(10, collateralsDecimal)
        : 0,
      token: SuiSupportedTokenEnum.SUI,
    };

    const borrowerFeePercent = item.borrowerFee / 100;
    const borrowFeeValue = getDecimalAmount(
            borrowInterestValue * borrowerFeePercent,
            item.network,
            item.symbol,
          );

    const repayOfferEvent =
      item.events?.filter((itemDetail) =>
        item.status === LoanStatus.FINISHED
          ? itemDetail.eventName === EventName.SystemFinishLoanOfferEvent
          : itemDetail.eventName === EventName.SystemRepayLoanOfferEvent,
      ) || [];

    const totalRepay = borrowFeeValue + borrowInterestValue + amount;

    const liquidatedEvent =
      item.liquidationEvents?.filter(
        (item) => item.eventName === EventName.LiquidatedCollateralEvent,
      ) || [];

    const liquidatingEvent =
      item.liquidationEvents?.filter(
        (item) => item.eventName === EventName.LiquidatingCollateralEvent,
      ) || [];

    const liquidateEvent =
      item.status === LoanStatus.FINISHED ? liquidatedEvent : liquidatingEvent;

    const liquidatePrice =
      item.status === LoanStatus.FINISHED
        ? liquidatedEvent[0]?.metadata?.liquidatedPrice
        : liquidatingEvent[0]?.metadata?.liquidatingPrice;

    const liquidatedHeathRatio = (liquidatePrice * collateral.amount) / amount;

    return {
      token: SuiSupportedTokenEnum.USDC,
      chain: SupportedChainEnum.Sui,
      tierId: item.templateId,
      loanOfferId: item.loanOfferId,
      lendOfferId: item.lendOfferId,

      borrowerAddress: item.borrowerAddress,
      lenderAddress: item.lenderAddress,

      amount: amount,
      duration: duration,
      healthRatio: undefined,
      endTimestamp: new Date(item.endDate).getTime() / 1000,

      borrowInterest: item.interestRate,
      borrowInterestValue: borrowInterestValue,

      borrowFee: item.borrowerFee,
      borrowFeeValue: borrowFeeValue,

      totalRepay: totalRepay,

      collateral: {
        amount: item.collaterals[0]?.amount
          ? item.collaterals[0].amount / Math.pow(10, collateralsDecimal)
          : 0,
        token: SuiSupportedTokenEnum.SUI,
      },

      repaidData: {
        txHash: repayOfferEvent[0]?.signature,
        timestamp: new Date(repayOfferEvent[0]?.createdAt).getTime() / 1000,
      },

      liquidatedData: {
        timestamp:
          new Date(liquidateEvent[0]?.createdAt).getTime() / 1000 ||
          new Date(item.endDate).getTime() / 1000,
        txHash: liquidateEvent[0]?.signature,
        totalRepaid: totalRepay,
        totalReceived:
          liquidateEvent[0]?.metadata?.remainingFundToBorrower /
          Math.pow(10, decimal),
        liquidatedHeathRatio: liquidatedHeathRatio,
        convertedLiquidatedValue:
          liquidateEvent[0]?.metadata?.collateralSwappedAmount /
          Math.pow(10, decimal),
      },
      status: item.status,
    };
  });

  return refactorData as unknown as LoanContractViewInterface[];
};

const getDecimalAmount = (
  value: number,
  network: SupportedChainEnum,
  symbol: SupportTokenType,
) => {
  const decimal = CommonUtils.getDecimalToken(network, symbol);
  return Math.floor(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
};
