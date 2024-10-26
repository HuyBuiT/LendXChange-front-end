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

const LiquidatedContractTable: React.FC<LiquidatedContractTableProps> = ({
  className,
  onChangePaging,
  ...otherProps
}) => {
  const { liquidatedLoanContract } = useLoanContext();

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <CommonTable className="w-full">
        <LoanContractTableHeader />
        <CommonTBody>
          {liquidatedLoanContract.pageData.map((item, index) => (
            <LoanContractTableRow loanContractData={item} key={index} />
          ))}
        </CommonTBody>
      </CommonTable>

      {liquidatedLoanContract.pagination.total >
        AppConstant.SIZE_PAGINATION_DEFAULT && (
        <CommonPagination
          currentPage={liquidatedLoanContract.pagination.pageNum}
          totalItem={liquidatedLoanContract.pagination.total}
          onChangePagination={onChangePaging}
        />
      )}
    </div>
  );
};

export default LiquidatedContractTable;

interface LiquidatedContractTableProps extends ComponentPropsWithoutRef<'div'> {
  onChangePaging: (dataPaging: { pageNum: number; pageSize: number }) => void;
}
