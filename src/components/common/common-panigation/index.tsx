'use client';

import React, { ComponentPropsWithoutRef, FC, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowDownFillIcon, ArrowEndIcon } from '@/components/icons';

import SelectPageSize from './SelectPageSize';

const CommonPagination: FC<CommonPaginationProps> = ({
  totalItem,
  currentPage,

  onChangePagination,
}) => {
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(currentPage);

  const totalPage = useMemo(() => {
    return Math.ceil(totalItem / pageSize);
  }, [totalItem, pageSize]);

  const handleChangePageNum = (pageNum: number) => {
    setPageNum(pageNum);
    onChangePagination({ pageNum, pageSize });
  };

  const handleChangePageSize = (pageSize: number) => {
    onChangePagination({ pageNum: currentPage, pageSize });
    setPageSize(pageSize);
  };

  return (
    <div className={twMerge('flex items-center gap-x-4')}>
      <SelectPageSize
        onChange={(e) => handleChangePageSize(Number(e.target.value))}
      />

      <div className="flex items-center gap-x-2">
        <ButtonNavigation
          disabled={pageNum <= 1}
          onClick={() =>
            handleChangePageNum(
              Math.max(pageNum - NEXT_OR_PREV_MULTI_PAGE, 0) || 1,
            )
          }
        >
          <ArrowEndIcon />
        </ButtonNavigation>

        <ButtonNavigation
          onClick={() => handleChangePageNum(pageNum - 1)}
          disabled={pageNum <= 1}
        >
          <ArrowDownFillIcon />
        </ButtonNavigation>
      </div>

      <p className="flex items-center gap-x-2">{`${pageNum}/${totalPage}`}</p>

      <div className="flex items-center gap-x-2">
        <ButtonNavigation
          onClick={() => handleChangePageNum(pageNum + 1)}
          disabled={pageNum >= totalPage}
        >
          <ArrowDownFillIcon className="rotate-180" />
        </ButtonNavigation>
        <ButtonNavigation
          disabled={pageNum >= totalPage}
          onClick={() =>
            handleChangePageNum(
              Math.min(pageNum + NEXT_OR_PREV_MULTI_PAGE, totalPage),
            )
          }
        >
          <ArrowEndIcon className="rotate-180" />
        </ButtonNavigation>
      </div>
    </div>
  );
};

export default CommonPagination;

interface CommonPaginationProps {
  currentPage: number;
  totalItem: number;

  onChangePagination: (dataPaging: {
    pageNum: number;
    pageSize: number;
  }) => void;
}

const ButtonNavigation: FC<ButtonNavigationProps> = ({
  disabled,
  children,
  className,
  ...otherProps
}) => {
  return (
    <button
      className={twMerge(
        'text-neutral5 hover:text-neutral3',
        disabled && 'hover:text-neutral5',
        className,
      )}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
};

interface ButtonNavigationProps extends ComponentPropsWithoutRef<'button'> {
  disable?: boolean;
}

const NEXT_OR_PREV_MULTI_PAGE = 5;
