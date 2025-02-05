'use client';

import React, { useState } from 'react';

import { TabsContent } from '@/components/common';
import { useDeepCompareEffect } from 'use-deep-compare';
import { useAppContext, useAuthContext, usePortfolioContext } from '@/context';

const PortfolioPage = () => {
  const {
    handleGetLoansBorrowed,
    handleGetSuppliedAssets,
  } = usePortfolioContext();

  useDeepCompareEffect(() => {
    handleGetLoansBorrowed();
    handleGetSuppliedAssets();
  }, []);

  return (
    <div className={'w-full mt-8'}>
      <p>Portfolio</p>
    </div>
  );
};

export default PortfolioPage;
