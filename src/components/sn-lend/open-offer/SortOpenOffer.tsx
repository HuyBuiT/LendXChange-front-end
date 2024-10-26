'use client';

import React, {
  FC,
  useState,
  useEffect,
  ComponentPropsWithoutRef,
} from 'react';
import { useLendContext } from '@/context';
import { twJoin, twMerge } from 'tailwind-merge';
import { CheckedIcon, SortIcon } from '@/components/icons';
import { StatusDisplayOfferEnum } from '@/context/LendProvider';
import { CommonButton, CommonDialog } from '@/components/common';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

const SortOpenOffer: FC<SortOpenOfferProps> = ({
  totalItem,
  onSelectOptionSort,
}) => {
  const { setSelectedTypeDisplayOffer } = useLendContext();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [checked, setChecked] = useState<StatusDisplayOfferEnum>(
    StatusDisplayOfferEnum.ALL,
  );

  const getLabel = (checked: StatusDisplayOfferEnum) => {
    switch (checked) {
      case StatusDisplayOfferEnum.ALL:
        return 'All';
      case StatusDisplayOfferEnum.OPEN_OFFER:
        return 'Open Offer';
      case StatusDisplayOfferEnum.CANCELED_OFFER:
        return 'Canceled Offer';
      default:
        return 'All';
    }
  };

  const handleApply = () => {
    onSelectOptionSort(checked);
    setIsOpenPopup(false);
  };

  useEffect(() => {
    setSelectedTypeDisplayOffer(StatusDisplayOfferEnum.ALL);
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
              {Object.values(StatusDisplayOfferEnum).map((item, index) => (
                <OptionSort
                  key={index}
                  label={getLabel(item)}
                  isChecked={checked === item}
                  onChecked={() => setChecked(item)}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 gap-x-4">
            <CommonButton
              variant={CommonButtonVariantEnum.OutlinePrimary}
              className="w-full"
              onClick={() => setChecked(StatusDisplayOfferEnum.ALL)}
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

export default SortOpenOffer;

interface SortOpenOfferProps {
  totalItem: number;
  onSelectOptionSort: (value: StatusDisplayOfferEnum) => void;
}

export const OptionSort: FC<OptionSortProps> = ({
  label,
  isChecked,
  className,
  onChecked,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'p-4',
        'flex items-center gap-x-2',
        'border-b border-characterBackground2',
        className,
      )}
      {...otherProps}
    >
      <div className="cursor-pointer" onClick={onChecked}>
        {isChecked ? (
          <CheckedIcon className="w-4 h-4 text-primary5 rounded" />
        ) : (
          <div className="w-4 h-4 border-white border-[2px] rounded" />
        )}
      </div>
      <p>{label}</p>
    </div>
  );
};

interface OptionSortProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
  isChecked: boolean;

  onChecked: () => void;
}
