import { Asset } from '@/models/app.model';
import { refactorContractList } from './helper';
import { LendService, LoanService } from '@/services';
import {
  SupportTokenType,
  DataListInterface,
  SupportedChainEnum,
  GetListLendContractParams,
  LoanContractViewInterface,
  TotalCardInfoValueViewInterface,
} from '@/models';

const useLoanHooks = () => {
  const handleGetLoanContractListByAddress = async (
    params: GetListLendContractParams,
    availableAssets: Map<SupportTokenType, Asset>,
  ) => {
    if (!params.walletAddress)
      return {
        pageData: [] as LoanContractViewInterface[],
        pagination: {
          total: 0,
          pageNum: 0,
        },
      };

    const responseData = await LendService.getContractListByAddress(
      params,
      'borrower',
    );

    const contractListData = responseData?.pageData;

    if (!contractListData?.length)
      return {
        pageData: [] as LoanContractViewInterface[],
        pagination: {
          total: 0,
          pageNum: 0,
        },
      };

    const loanContracts = contractListData.filter(
      (item) => item.borrowerAddress === params.walletAddress,
    );

    const refactorContract = refactorContractList(
      loanContracts,
      availableAssets,
    );

    return {
      pageData: refactorContract as LoanContractViewInterface[],
      pagination: {
        pageNum: responseData?.pageNum || 1,
        total: responseData?.total || 0,
      },
    } as DataListInterface<LoanContractViewInterface[]>;
  };

  const handleGetLoanDashboard = async (selectedChain: SupportedChainEnum) => {
    const responseData = await LoanService.getLoanDashboard(selectedChain);

    if (responseData) {
      return responseData;
    } else {
      return {} as TotalCardInfoValueViewInterface;
    }
  };

  return { handleGetLoanDashboard, handleGetLoanContractListByAddress };
};

export default useLoanHooks;
