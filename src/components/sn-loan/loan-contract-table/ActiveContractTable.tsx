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

const ActiveContractTable: React.FC<ActiveContractTableProps> = ({
  className,
  onChangePaging,
  ...otherProps
}) => {
  const { activeLoanContract } = useLoanContext();

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <CommonTable className="w-full">
        <LoanContractTableHeader />
        <CommonTBody>
          {activeLoanContract.pageData.map((item, index) => (
            <LoanContractTableRow loanContractData={item} key={index} />
          ))}
        </CommonTBody>
      </CommonTable>

      {activeLoanContract.pagination.total >
        AppConstant.SIZE_PAGINATION_DEFAULT && (
        <CommonPagination
          currentPage={activeLoanContract.pagination.pageNum}
          totalItem={activeLoanContract.pagination.total}
          onChangePagination={onChangePaging}
        />
      )}
    </div>
  );
};

export default ActiveContractTable;

interface ActiveContractTableProps extends ComponentPropsWithoutRef<'div'> {
  onChangePaging: (dataPaging: { pageNum: number; pageSize: number }) => void;
}
