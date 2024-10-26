'use client';

import React, { useMemo } from 'react';
import { AppConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonPagination } from '@/components/common';
import { useAuthContext, useLoanContext } from '@/context';
import { StatusDisplayLoanContractEnum } from '@/context/LoanProvider';
import LoanSort from './LoanSort';
import LoanContractCard from './LoanContractCard';

const LoanContractCardList = () => {
  const { t: getLabel } = useTranslation();

  const {
    loanContractData,
    activeLoanContract,
    repaidLoanContract,
    liquidatedLoanContract,
    selectedTypeDisplayLoanContract,
    setSelectedTypeDisplayLoanContract,
    handleGetLoanContract,
  } = useLoanContext();
  const { connectedChainAddress } = useAuthContext();

  const listLoanContract = useMemo(() => {
    if (
      selectedTypeDisplayLoanContract ===
      StatusDisplayLoanContractEnum.ACTIVE_CONTRACT
    ) {
      return activeLoanContract;
    } else if (
      selectedTypeDisplayLoanContract ===
      StatusDisplayLoanContractEnum.REPAID_CONTRACT
    ) {
      return repaidLoanContract;
    } else if (
      selectedTypeDisplayLoanContract ===
      StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT
    ) {
      return liquidatedLoanContract;
    } else {
      return loanContractData;
    }
  }, [
    selectedTypeDisplayLoanContract,
    activeLoanContract,
    repaidLoanContract,
    loanContractData,
  ]);

  const handleGetLoanList = async (
    selectType: StatusDisplayLoanContractEnum,
    pageNum = 1,
    pageSize = 5,
  ) => {
    const params = {
      walletAddress: connectedChainAddress,
      pageNum: pageNum,
      pageSize: pageSize,
    };

    await handleGetLoanContract(params, selectType);
  };

  const handleGetCurrentPage = (type: StatusDisplayLoanContractEnum) => {
    if (type === StatusDisplayLoanContractEnum.ACTIVE_CONTRACT) {
      return activeLoanContract.pagination.pageNum;
    } else if (type === StatusDisplayLoanContractEnum.REPAID_CONTRACT) {
      return repaidLoanContract.pagination.pageNum;
    } else if (type === StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT) {
      return liquidatedLoanContract.pagination.pageNum;
    } else {
      return loanContractData.pagination.pageNum;
    }
  };

  return (
    <div
      className={twJoin(
        'w-full',
        'px-4 py-6',
        'flex flex-col gap-y-4',
        'bg-characterBackground3',
      )}
    >
      <p>{getLabel('lContract')}</p>
      <LoanSort
        totalContract={listLoanContract.pagination.total}
        onSelectOptionSort={(value) => {
          handleGetLoanList(value, handleGetCurrentPage(value));
          setSelectedTypeDisplayLoanContract(value);
        }}
      />

      <div className="flex flex-col gap-y-4">
        {listLoanContract.pageData.map((item, index) => (
          <LoanContractCard loanContractData={item} key={index} />
        ))}
      </div>

      {listLoanContract.pagination.total >
        AppConstant.SIZE_PAGINATION_DEFAULT && (
        <CommonPagination
          currentPage={listLoanContract.pagination.pageNum}
          totalItem={listLoanContract.pagination.total}
          onChangePagination={(data) =>
            handleGetLoanList(
              selectedTypeDisplayLoanContract,
              data.pageNum,
              data.pageSize,
            )
          }
        />
      )}
    </div>
  );
};

export default LoanContractCardList;
