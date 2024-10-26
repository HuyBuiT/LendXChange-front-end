'use client';

import React, { ComponentPropsWithoutRef } from 'react';

import {
  CommonTable,
  CommonTBody,
  CommonPagination,
} from '@/components/common';

import { AppConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useLoanContext } from '@/context';
import LoanContractTableRow from './LoanContractTableRow';
import LoanContractTableHeader from './LoanContractTableHeader';

const RepaidContractTable: React.FC<RepaidContractTableProps> = ({
  className,
  onChangePaging,
  ...otherProps
}) => {
  const { repaidLoanContract } = useLoanContext();

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <CommonTable className="w-full">
        <LoanContractTableHeader />
        <CommonTBody>
          {repaidLoanContract.pageData.map((item, index) => (
            <LoanContractTableRow loanContractData={item} key={index} />
          ))}
        </CommonTBody>
      </CommonTable>

      {repaidLoanContract.pagination.total >
        AppConstant.SIZE_PAGINATION_DEFAULT && (
        <CommonPagination
          currentPage={repaidLoanContract.pagination.pageNum}
          totalItem={repaidLoanContract.pagination.total}
          onChangePagination={onChangePaging}
        />
      )}
    </div>
  );
};

export default RepaidContractTable;

interface RepaidContractTableProps extends ComponentPropsWithoutRef<'div'> {
  onChangePaging: (dataPaging: { pageNum: number; pageSize: number }) => void;
}
