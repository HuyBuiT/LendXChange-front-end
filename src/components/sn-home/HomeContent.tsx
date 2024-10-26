'use client';

import React, { Fragment } from 'react';
import { AppConstant } from '@/const';
import { OfferCard, OfferTable } from '.';
import { useHomeContext } from '@/context';
import { useWindowSize } from '@/hooks/common-hooks';
import NoCollaboratorCardDialog from '../common/NoCollaboratorCardDialog';

const HomeContent = () => {
  const { windowWidth } = useWindowSize();

  const { offersTemplate } = useHomeContext();
  const { isOpenNoCollaboratorDialog, setIsOpenNoCollaboratorDialog } =
    useHomeContext();

  return (
    <>
      {offersTemplate.length > 0 ? (
        <>
          {windowWidth <= AppConstant.BREAK_POINTS.sm ? (
            <div className="flex flex-col gap-y-4">
              {offersTemplate.map((item, index) => (
                <OfferCard key={index} offerData={item} />
              ))}
            </div>
          ) : (
            <OfferTable offerTableData={offersTemplate} />
          )}
        </>
      ) : (
        <Fragment />
      )}

      <NoCollaboratorCardDialog
        isOpen={isOpenNoCollaboratorDialog}
        onClose={() => setIsOpenNoCollaboratorDialog(false)}
      />
    </>
  );
};

export default HomeContent;
