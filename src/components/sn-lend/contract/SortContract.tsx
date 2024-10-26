'use client';

import React, { FC, useEffect, useState } from 'react';
import { useLendContext } from '@/context';
import { twJoin } from 'tailwind-merge';
import { SortIcon } from '@/components/icons';
import { OptionSort } from '../open-offer/SortOpenOffer';
import { CommonButton, CommonDialog } from '@/components/common';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';
import { StatusDisplayLendContractEnum } from '@/context/LendProvider';

const SortContract: FC<SortContractProps> = ({
  totalItem,
  onSelectOptionSort,
}) => {
  const { setSelectedTypeDisplayLendContract } = useLendContext();

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [checked, setChecked] = useState<StatusDisplayLendContractEnum>(
    StatusDisplayLendContractEnum.ALL,
  );

  const getLabel = (checked: StatusDisplayLendContractEnum) => {
    switch (checked) {
      case StatusDisplayLendContractEnum.ALL:
        return 'All';
      case StatusDisplayLendContractEnum.ACTIVE_CONTRACT:
        return 'Active Contract';
      case StatusDisplayLendContractEnum.REPAID_CONTRACT:
        return 'Repaid Contract';
      default:
        return 'All';
    }
  };

  const handleApply = () => {
    onSelectOptionSort(checked);
    setIsOpenPopup(false);
  };

  useEffect(() => {
    setSelectedTypeDisplayLendContract(StatusDisplayLendContractEnum.ALL);
  }, []);

  return (
    <>
      <CommonButton
        variant={CommonButtonVariantEnum.Primary}
        onClick={() => setIsOpenPopup(true)}
      >
        <SortIcon />
        {getLabel(checked)}
        {totalItem > 0 && `(${totalItem})`}
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
              {Object.values(StatusDisplayLendContractEnum).map(
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
              onClick={() => setChecked(StatusDisplayLendContractEnum.ALL)}
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

export default SortContract;

interface SortContractProps {
  totalItem: number;
  onSelectOptionSort: (value: StatusDisplayLendContractEnum) => void;
}
