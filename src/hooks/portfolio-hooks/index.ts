import { getLoanBorrowedService, getSuppliedAssetService } from '@/services/home-services';
import {
  refactorLoanBorrowed,
  refactorSuppliedAsset,
} from './helper';
import { SuppliedAssetInterface, LoanBorrowedInterface } from '@/models/home.model';

const usePortfolioHooks = () => {
  const handleGetSuppliedAsset = async (access: string) => {
    const responseData = await getSuppliedAssetService(access);

    if (responseData) {
      return refactorSuppliedAsset(responseData) as SuppliedAssetInterface;
    } else {
      return {} as SuppliedAssetInterface;
    }
  };

  const handleGetLoanBorrowed = async (access: string) => {
    const responseData = await getLoanBorrowedService(access);

    if (responseData) {
      return refactorLoanBorrowed(responseData) as LoanBorrowedInterface[];
    } else {
      return [] as LoanBorrowedInterface[];
    }
  };

  return {
    handleGetLoanBorrowed,
    handleGetSuppliedAsset,
  };
};

export default usePortfolioHooks;
