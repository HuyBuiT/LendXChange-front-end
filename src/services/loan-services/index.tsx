import {
  BaseResponseData,
  TokenDecimalsEnum,
  SupportedChainEnum,
  TotalCardInfoValueViewInterface,
} from '@/models';
import { ApiConstant } from '@/const';
import { ApiResponse } from 'apisauce';
import { createDappServices } from '../config';
import { CommonUtils, FormatUtils } from '@/utils';

export const getLoanDashboard = async (selectedChain: SupportedChainEnum) => {
  const response: ApiResponse<BaseResponseData<ResLoanDashboard>> =
    await createDappServices().get(ApiConstant.GET_LOANS_DASHBOARD, {
      network: selectedChain,
    });

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return {
      totalInterestPaid: FormatUtils.convertDisplayUnit(
        responseData.totalInterestPaid,
        TokenDecimalsEnum.USDC,
      ),
      totalActiveContracts: responseData.totalActiveContracts,
      totalInterestActiveContractValue: FormatUtils.convertDisplayUnit(
        responseData.totalActiveContractsValue,
        TokenDecimalsEnum.USDC,
      ),
      totalBorrowed: FormatUtils.convertDisplayUnit(
        responseData.totalBorrowedValue,
        TokenDecimalsEnum.USDC,
      ),
      totalContracts: responseData.totalBorrowedContracts,
      fluctuationsInterest: FormatUtils.convertDisplayUnit(
        responseData.totalInterestInActiveContract,
        TokenDecimalsEnum.USDC,
      ),
    } as TotalCardInfoValueViewInterface;
  } else {
    return undefined;
  }
};

export interface ResLoanDashboard {
  totalInterestPaid: number;
  totalBorrowedValue: number;
  totalActiveContracts: number;
  totalBorrowedContracts: number;
  totalActiveContractsValue: number;
  totalInterestPaidContracts: number;
  totalInterestInActiveContract: number;
}
