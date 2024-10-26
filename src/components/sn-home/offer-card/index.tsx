'use client';

import React, { useState } from 'react';
import { OfferInfoDialog } from '../offers-info';
import { twJoin, twMerge } from 'tailwind-merge';
import { OfferDataDetailViewInterface } from '@/models';
import { useAuthContext, useHomeContext } from '@/context';
import { BorrowButton, LendButton } from '../offers-action-buttons';

import OfferCardHead from './OfferCardHead';
import OfferCardContent from './OfferCardContent';
import CreateLendOfferDialog from '../create-lend-offer-dialog';
import CreateBorrowOfferDialog from '../create-borrow-offer-dialog';

const OfferCard: React.FC<OfferCardProps> = ({ offerData, className }) => {
  const { setIsOpenNoCollaboratorDialog, isHasNft } = useHomeContext();
  const { isWalletConnected, setIsOpenConnectDialog } = useAuthContext();

  const [isOpenOffersInfo, setIsOpenOfferInfo] = useState(false);
  const [isOpenBorrowDialog, setIsOpenBorrowDialog] = useState(false);
  const [isOpenCreateLendDialog, setIsOpenCreateLendDialog] = useState(false);

  const handleOpenCreateBorrowDialog = () => {
    if (!isWalletConnected) {
      setIsOpenConnectDialog(true);
      return;
    }

    if (!isHasNft) {
      setIsOpenNoCollaboratorDialog(true);
      return;
    }

    if (!offerData.bestOffer) return;

    setIsOpenBorrowDialog(true);
  };

  const handleOpenCreateLendDialog = () => {
    if (!isWalletConnected) {
      setIsOpenConnectDialog(true);
      return;
    }

    if (!isHasNft) {
      setIsOpenNoCollaboratorDialog(true);
      return;
    }

    setIsOpenCreateLendDialog(true);
  };

  return (
    <>
      <div
        className={twMerge(
          'px-5 py-4',
          'rounded-lg',
          'flex flex-col gap-y-3',
          'bg-characterBackground2',
          className,
        )}
      >
        <OfferCardHead
          chain={offerData.chain}
          amount={offerData.amount}
          token={offerData.token}
          onViewOrder={() => setIsOpenOfferInfo(true)}
        />
        <OfferCardContent
          durations={offerData.durations}
          bestOffer={offerData.bestOffer}
          volume={offerData.volume}
        />
        <div className={twJoin('w-full', 'space-between-root gap-x-2')}>
          <LendButton className="w-full" onClick={handleOpenCreateLendDialog} />

          <BorrowButton
            className="w-full"
            onClick={handleOpenCreateBorrowDialog}
          />
        </div>
      </div>

      <OfferInfoDialog
        offerData={offerData}
        isOpen={isOpenOffersInfo}
        onClose={() => setIsOpenOfferInfo(false)}
      />

      <CreateLendOfferDialog
        offerData={offerData}
        isOpen={isOpenCreateLendDialog}
        onClose={() => setIsOpenCreateLendDialog(false)}
      />

      <CreateBorrowOfferDialog
        offerData={offerData}
        isOpen={isOpenBorrowDialog}
        onClose={() => setIsOpenBorrowDialog(false)}
      />
    </>
  );
};

export default OfferCard;

interface OfferCardProps extends React.ComponentPropsWithRef<'div'> {
  offerData: OfferDataDetailViewInterface;
}
