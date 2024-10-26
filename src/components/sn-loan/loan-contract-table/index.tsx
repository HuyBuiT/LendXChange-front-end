'use client';

import React, { ComponentPropsWithoutRef } from 'react';

import {
  useLoanContext,
  StatusDisplayLoanContractEnum,
} from '@/context/LoanProvider';
import { twMerge } from 'tailwind-merge';
import { useAuthContext } from '@/context';
import { useTranslation } from 'react-i18next';
import { TabsContent } from '@radix-ui/react-tabs';
import { TabsList, TabsRoot } from '@/components/common';
import { LendTabTrigger } from '@/components/sn-lend/lend-tabs/LendTabHeader';

import ActiveContractTable from './ActiveContractTable';
import RepaidContractTable from './RepaidContractTable';
import LiquidatedContractTable from './LiquidatedContract';

const LoanContractTable: React.FC<LoanContractTableProps> = ({
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { connectedChainAddress } = useAuthContext();

  const {
    activeLoanContract,
    repaidLoanContract,
    liquidatedLoanContract,
    selectedTypeDisplayLoanContract,
    setSelectedTypeDisplayLoanContract,
    handleGetLoanContract,
  } = useLoanContext();

  const handleGetContract = async (
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

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <p>{getLabel('lContract')}</p>

      <TabsRoot
        value={selectedTypeDisplayLoanContract}
        defaultValue={StatusDisplayLoanContractEnum.ACTIVE_CONTRACT}
        className="w-full"
      >
        <LoanTab
          totalActiveContract={activeLoanContract.pagination.total}
          totalRepaidContract={repaidLoanContract.pagination.total}
          totalLiquidatedContract={liquidatedLoanContract.pagination.total}
          onChangeTab={(value) => {
            handleGetContract(
              value,
              value === StatusDisplayLoanContractEnum.ACTIVE_CONTRACT
                ? activeLoanContract.pagination.pageNum
                : value === StatusDisplayLoanContractEnum.REPAID_CONTRACT
                  ? repaidLoanContract.pagination.pageNum
                  : liquidatedLoanContract.pagination.pageNum,
            );
            setSelectedTypeDisplayLoanContract(value);
          }}
        />

        <TabsContent value={StatusDisplayLoanContractEnum.ACTIVE_CONTRACT}>
          <ActiveContractTable
            onChangePaging={(data) =>
              handleGetContract(
                selectedTypeDisplayLoanContract,
                data.pageNum,
                data.pageSize,
              )
            }
          />
        </TabsContent>

        <TabsContent value={StatusDisplayLoanContractEnum.REPAID_CONTRACT}>
          <RepaidContractTable
            onChangePaging={(data) =>
              handleGetContract(
                selectedTypeDisplayLoanContract,
                data.pageNum,
                data.pageSize,
              )
            }
          />
        </TabsContent>

        <TabsContent value={StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT}>
          <LiquidatedContractTable
            onChangePaging={(data) =>
              handleGetContract(
                selectedTypeDisplayLoanContract,
                data.pageNum,
                data.pageSize,
              )
            }
          />
        </TabsContent>
      </TabsRoot>
    </div>
  );
};

export default LoanContractTable;

interface LoanContractTableProps extends ComponentPropsWithoutRef<'div'> {}

const LoanTab: React.FC<OpenOfferTabProps> = ({
  totalActiveContract,
  totalRepaidContract,
  totalLiquidatedContract,
  onChangeTab,
}) => {
  return (
    <TabsList className="w-full flex items-center gap-x-1">
      <LendTabTrigger
        className="text-sm"
        value={StatusDisplayLoanContractEnum.ACTIVE_CONTRACT}
        onClick={() =>
          onChangeTab(StatusDisplayLoanContractEnum.ACTIVE_CONTRACT)
        }
      >
        Active Contract {totalActiveContract > 0 && `(${totalActiveContract})`}
      </LendTabTrigger>
      <LendTabTrigger
        className="text-sm"
        value={StatusDisplayLoanContractEnum.REPAID_CONTRACT}
        onClick={() =>
          onChangeTab(StatusDisplayLoanContractEnum.REPAID_CONTRACT)
        }
      >
        Repaid Contract {totalRepaidContract > 0 && `(${totalRepaidContract})`}
      </LendTabTrigger>
      <LendTabTrigger
        className="text-sm"
        value={StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT}
        onClick={() =>
          onChangeTab(StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT)
        }
      >
        Liquidated Contract{' '}
        {totalLiquidatedContract > 0 && `(${totalLiquidatedContract})`}
      </LendTabTrigger>
    </TabsList>
  );
};

interface OpenOfferTabProps extends ComponentPropsWithoutRef<'div'> {
  totalActiveContract: number;
  totalRepaidContract: number;
  totalLiquidatedContract: number;
  onChangeTab: (value: StatusDisplayLoanContractEnum) => void;
}
