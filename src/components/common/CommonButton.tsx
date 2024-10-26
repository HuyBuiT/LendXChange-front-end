'use client';

import React, { useMemo } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import Loading from './Loading';

const CommonButton: React.FC<CommonButtonProps> = ({
  variant = CommonButtonVariantEnum.Primary,
  children,
  disabled,
  className,
  isLoading = false,
  ...otherProps
}) => {
  const variantStyle = useMemo(() => {
    switch (variant) {
      case CommonButtonVariantEnum.Primary:
        return 'bg-primary6 hover:bg-primary4 text-neutral1';
      case CommonButtonVariantEnum.Secondary:
        return 'bg-neutral1 hover:text-primary5 text-neutral5';
      case CommonButtonVariantEnum.Outline:
        return 'bg-transparent hover:bg-characterBackground2 border border-neutral7';
      case CommonButtonVariantEnum.Grey:
        return 'bg-characterBackground2 hover:bg-characterBackground3 text-neutral3';
      case CommonButtonVariantEnum.Lend:
        return 'bg-brandTertiary/15 hover:bg-brandTertiary/30 text-brandTertiary';
      case CommonButtonVariantEnum.Borrow:
        return 'bg-characterDown/15 hover:bg-characterDown/30 text-characterDown';
      case CommonButtonVariantEnum.Edit:
        return 'bg-primary6/15 hover:bg-primary6/40 text-primary5';
      case CommonButtonVariantEnum.OutlinePrimary:
        return 'text-primary5 border border-primary5 bg-transparent hover:bg-characterBackground2/50';
      case CommonButtonVariantEnum.PointSystem:
        return 'text-neutral1 bg-bgPointSystemButton rounded-full shadow-pointSystem';
      default:
        return '';
    }
  }, [variant]);

  return (
    <button
      className={twMerge(
        'text-sm',
        'py-2 px-4 rounded-lg',
        'font-inter font-medium',
        disabled && 'opacity-40',
        'focus-visible:outline-none',
        'flex items-center justify-center gap-x-2',
        variantStyle,
        className,
      )}
      disabled={disabled}
      {...otherProps}
    >
      <Loading className={twJoin(isLoading ? 'inline-block' : 'hidden')} />
      {children}
    </button>
  );
};

export default CommonButton;

export interface CommonButtonProps
  extends React.ComponentPropsWithRef<'button'> {
  variant?: CommonButtonVariantEnum;
  loadingIconClassName?: string;
  isLoading?: boolean;
}

export enum CommonButtonVariantEnum {
  Primary = 'primary',
  Secondary = 'secondary',
  Outline = 'outlined',
  Grey = 'grey',
  Lend = 'lend',
  Borrow = 'borrow',
  Edit = 'edit',
  OutlinePrimary = 'outlined primary',
  PointSystem = 'point system',
}
