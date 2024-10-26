'use client';

import React, { ComponentPropsWithoutRef } from 'react';

import { TabsList, TabsRoot, TabsContent } from '@/components/common';

import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { useAuthContext, useLendContext } from '@/context';
import { LendTabTrigger } from '../../lend-tabs/LendTabHeader';
import { StatusDisplayLendContractEnum } from '@/context/LendProvider';

import ActiveContractTable from './ActiveContractTable';
import RepaidContractTable from './RepaidContractTable';

const ContractTable: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  className,
  ...otherProps
}) => {
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const { connectedChainAddress } = useAuthContext();

  const {
    activeContracts,
    repaidContracts,
    selectedTypeDisplayLendContract,
    handleGetContractList,
    setSelectedTypeDisplayLendContract,
  } = useLendContext();

  const handleGetContract = async (
    selectType: StatusDisplayLendContractEnum,
    pageNum = 1,
    pageSize = 5,
  ) => {
    const params = {
      walletAddress: connectedChainAddress,
      pageNum: pageNum,
      pageSize: pageSize,
    };

    await handleGetContractList(params, selectType);
  };

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <p>{getLendLabel('lContract')}</p>
      <TabsRoot
        value={selectedTypeDisplayLendContract}
        defaultValue={StatusDisplayLendContractEnum.ACTIVE_CONTRACT}
        className="w-full"
      >
        <OpenOfferTab
          totalActiveContract={activeContracts.pagination.total}
          totalRepaidContract={repaidContracts.pagination.total}
          onChangeTab={(value) => {
            handleGetContract(
              value,
              value === StatusDisplayLendContractEnum.ACTIVE_CONTRACT
                ? activeContracts.pagination.pageNum
                : repaidContracts.pagination.pageNum,
            );
            setSelectedTypeDisplayLendContract(value);
          }}
        />

        <TabsContent value={StatusDisplayLendContractEnum.ACTIVE_CONTRACT}>
          <ActiveContractTable
            onChangePaging={(data) =>
              handleGetContract(
                selectedTypeDisplayLendContract,
                data.pageNum,
                data.pageSize,
              )
            }
          />
        </TabsContent>

        <TabsContent value={StatusDisplayLendContractEnum.REPAID_CONTRACT}>
          <RepaidContractTable
            onChangePaging={(data) =>
              handleGetContract(
                selectedTypeDisplayLendContract,
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

export default ContractTable;

const OpenOfferTab: React.FC<OpenOfferTabProps> = ({
  totalActiveContract,
  totalRepaidContract,
  onChangeTab,
}) => {
  return (
    <TabsList className="w-full flex items-center">
      <LendTabTrigger
        className="text-sm"
        value={StatusDisplayLendContractEnum.ACTIVE_CONTRACT}
        onClick={() =>
          onChangeTab(StatusDisplayLendContractEnum.ACTIVE_CONTRACT)
        }
      >
        Active Contract {totalActiveContract > 0 && `(${totalActiveContract})`}
      </LendTabTrigger>
      <LendTabTrigger
        className="text-sm"
        value={StatusDisplayLendContractEnum.REPAID_CONTRACT}
        onClick={() =>
          onChangeTab(StatusDisplayLendContractEnum.REPAID_CONTRACT)
        }
      >
        Repaid Contract {totalRepaidContract > 0 && `(${totalRepaidContract})`}
      </LendTabTrigger>
    </TabsList>
  );
};

interface OpenOfferTabProps extends ComponentPropsWithoutRef<'div'> {
  totalActiveContract: number;
  totalRepaidContract: number;
  onChangeTab: (value: StatusDisplayLendContractEnum) => void;
}
