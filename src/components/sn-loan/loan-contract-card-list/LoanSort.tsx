'use client';

import React, { FC, useEffect, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { useLoanContext } from '@/context';
import { SortIcon } from '@/components/icons';
import { CommonButton, CommonDialog } from '@/components/common';
import { StatusDisplayLoanContractEnum } from '@/context/LoanProvider';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';
import { OptionSort } from '@/components/sn-lend/open-offer/SortOpenOffer';

const LoanSort: FC<SortOpenOfferProps> = ({
  totalContract,
  onSelectOptionSort,
}) => {
  const { setSelectedTypeDisplayLoanContract } = useLoanContext();

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [checked, setChecked] = useState<StatusDisplayLoanContractEnum>(
    StatusDisplayLoanContractEnum.ALL,
  );

  const getLabel = (checked: StatusDisplayLoanContractEnum) => {
    switch (checked) {
      case StatusDisplayLoanContractEnum.ALL:
        return 'All';
      case StatusDisplayLoanContractEnum.ACTIVE_CONTRACT:
        return 'Active Contract';
      case StatusDisplayLoanContractEnum.REPAID_CONTRACT:
        return 'Repaid Contract';
      case StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT:
        return 'Liquidated Contract';
      default:
        return 'All';
    }
  };

  const handleApply = () => {
    onSelectOptionSort(checked);
    setIsOpenPopup(false);
  };

  useEffect(() => {
    setSelectedTypeDisplayLoanContract(StatusDisplayLoanContractEnum.ALL);
  }, []);

  return (
    <>
      <CommonButton
        variant={CommonButtonVariantEnum.Primary}
        onClick={() => setIsOpenPopup(true)}
      >
        <SortIcon />
        {getLabel(checked)}
        {totalContract > 0 && `(${totalContract})`}
      </CommonButton>

      <CommonDialog
        isOpen={isOpenPopup}
        dialogTitle=""
        onClose={() => setIsOpenPopup(false)}
        closeIconClassName="right-4 top-4 z-50"
        contentClassName={twJoin(
          'p-0',
          'w-full h-[80vh] overflow-visible z-[1000]',
        )}
      >
        <div className="w-full h-full flex flex-col justify-between pb-6">
          <div>
            <p className="px-4 py-5 border-b border-neutral7 w-full">Sort</p>
            <div>
              {Object.values(StatusDisplayLoanContractEnum).map(
                (item, index) => (
                  <OptionSort
                    key={index}
                    label={getLabel(item)}
                    isChecked={checked === item}
                    onChecked={() => setChecked(item)}
                  />
                ),
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 gap-x-4">
            <CommonButton
              variant={CommonButtonVariantEnum.OutlinePrimary}
              className="w-full"
              onClick={() => setChecked(StatusDisplayLoanContractEnum.ALL)}
            >
              Reset
            </CommonButton>
            <CommonButton className="w-full" onClick={handleApply}>
              Apply
            </CommonButton>
          </div>
        </div>
      </CommonDialog>
    </>
  );
};

export default LoanSort;

interface SortOpenOfferProps {
  totalContract: number;
  onSelectOptionSort: (value: StatusDisplayLoanContractEnum) => void;
}
