'use client';

import React from 'react';
import { CommonUtils } from '@/utils';
import { AppConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useAuthContext } from '@/context';
import { useWindowSize } from '@/hooks/common-hooks';
import { CaretIcon, WalletIcon } from '@/components/icons';
import DropdownActions from './DropdownActions';

const AccountButton = () => {
  const { windowWidth } = useWindowSize();

  const { connectedChainAddress } = useAuthContext();

  return (
    <DropdownActions>
      <span
        className={twJoin(
          'gap-x-2',
          'py-2 px-4',
          'font-normal',
          'rounded-[56px]',
          'flex items-center',
          'max-h-[36px] sm:max-h-[40px]',
          'bg-black/10 sm:bg-characterBackground2 hover:bg-characterBackground3',
        )}
      >
        {windowWidth > AppConstant.BREAK_POINTS.sm ? (
          <>
            {CommonUtils.truncateHash(connectedChainAddress)}
            <CaretIcon className="text-neutral1" />
          </>
        ) : (
          <WalletIcon className={twJoin('w-5 h-5', 'text-neutral5')} />
        )}
      </span>
    </DropdownActions>
  );
};

export default AccountButton;
