'use client';

import React, { Fragment, useState } from 'react';
import { AppConstant } from '@/const';
import { OfferCard, OfferTable } from '.';
import { useHomeContext } from '@/context';
import { useWindowSize } from '@/hooks/common-hooks';
import NoCollaboratorCardDialog from '../common/NoCollaboratorCardDialog';
import { MessageCircle, X } from 'lucide-react';
import AIAssistant from '../common/AiAssistantChat';

const HomeContent = () => {
  const { windowWidth } = useWindowSize();

  const { offersTemplate } = useHomeContext();
  const { isOpenNoCollaboratorDialog, setIsOpenNoCollaboratorDialog } =
    useHomeContext();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-white text-center mb-3">Offer Templates</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto text-sm leading-relaxed">
          Browse these templates to create lending offers or take loan. Select a suitable template for you and click "Create offer" to lend or "Take a loan" to borrow.
        </p>
      </div>

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

      {/* AI Assistant Chat Button */}
      <AIAssistant />
      
      <NoCollaboratorCardDialog
        isOpen={isOpenNoCollaboratorDialog}
        onClose={() => setIsOpenNoCollaboratorDialog(false)}
      />
    </>
  );
};

export default HomeContent;
