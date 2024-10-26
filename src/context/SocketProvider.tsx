'use client';

import React, { useContext, useState, useEffect } from 'react';

import {
  BestOfferSocketResponseInterface,
  ActiveLoanSocketResponseInterface,
} from '@/models';

import { Socket, io } from 'socket.io-client';
import { useHomeContext } from './HomeProvider';
import { pushNewOffer, removeBestOffer, pushNewActiveLoan } from './helper';
import { useAppContext } from '.';

const INITIAL_STATE = {} as any;

const SocketContext = React.createContext(INITIAL_STATE);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketUrl = process.env.DAPP_SOCKET_URL || '';

  const { selectedChain } = useAppContext();
  const {
    bestOfferList,
    activeLoanList,

    setBestOfferList,
    setActiveLoanList,
    handleGetTemplates,
  } = useHomeContext();

  const [offersSocket, setOffersSocket] = useState<Socket | null>(null);
  const [loansSocket, setLoansSocket] = useState<Socket | null>(null);

  const handlePushNewActiveLoan = (
    newLoan: ActiveLoanSocketResponseInterface,
  ) => {
    const newLoanList = pushNewActiveLoan(newLoan, activeLoanList);
    const bestOffers = removeBestOffer(newLoan, bestOfferList);
    setActiveLoanList([...newLoanList]);
    setBestOfferList([...bestOffers]);
  };

  const handleRemoveCanceledOffer = (
    canceledOffer: BestOfferSocketResponseInterface,
  ) => {
    const bestOffers = removeBestOffer(canceledOffer, bestOfferList);
    setBestOfferList([...bestOffers]);
  };

  const handlePushNewOffer = (newOffer: BestOfferSocketResponseInterface) => {
    const bestOffers = pushNewOffer(newOffer, bestOfferList);
    setBestOfferList([...bestOffers]);
  };

  useEffect(() => {
    if (!socketUrl || !selectedChain) return;

    const socketOffers = io(
      `${socketUrl}/${selectedChain.toLowerCase()}_offers`,
      DEFAULT_SETTING,
    );
    const socketLoans = io(
      `${socketUrl}/${selectedChain.toLowerCase()}_loans`,
      DEFAULT_SETTING,
    );

    setOffersSocket(socketOffers);
    setLoansSocket(socketLoans);
  }, [selectedChain]);

  useEffect(() => {
    if (!offersSocket) return;

    if (!offersSocket.connected) {
      offersSocket.connect();
    }

    offersSocket.on(
      'offer:created',
      (value: BestOfferSocketResponseInterface) => {
        if (value.id) {
          handleGetTemplates(selectedChain);
          handlePushNewOffer(value);
        }
      },
    );

    offersSocket.on(
      'offer:canceling',
      (value: BestOfferSocketResponseInterface) => {
        handleGetTemplates(selectedChain);
        handleRemoveCanceledOffer(value);
      },
    );

    return () => {
      offersSocket.off('offer:created');
      offersSocket.off('offer:canceling');
      offersSocket.disconnect();
    };
  }, [offersSocket, bestOfferList, selectedChain]);

  useEffect(() => {
    if (!loansSocket || !selectedChain) return;

    if (!loansSocket.connected) {
      loansSocket.connect();
    }

    loansSocket.on(
      'loan:created',
      (value: ActiveLoanSocketResponseInterface) => {
        if (!value.id) return;
        handlePushNewActiveLoan(value);
      },
    );

    loansSocket.on('connect_error', (err) => {
      console.log(err);
    });

    return () => {
      loansSocket.off('loan:created');
      loansSocket.disconnect();
    };
  }, [loansSocket, activeLoanList, bestOfferList, selectedChain]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

const DEFAULT_SETTING = {
  autoConnect: false,
  transports: ['websocket'],
};
