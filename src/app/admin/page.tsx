'use client';

import React, { useEffect, useState } from 'react';
import { useAuthContext, usePortfolioContext } from '@/context';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AdminAddresses } from '@/components/layout/main-layout/navigation/DesktopNavigation';
import { useDeepCompareEffect } from 'use-deep-compare';
import { addSubdomain } from '@/utils/common.utils';
import { NetworkModeEnum } from '@/models';
import { ArrowLeft, ArrowRight } from 'lucide-react';
const AdminPage = () => {
  const { handleGetSystemLoansBorrowed, handleGetSystemStatistics } = usePortfolioContext();

  useDeepCompareEffect(() => {
    handleGetSystemStatistics();
    handleGetSystemLoansBorrowed();
  }, []);

  const { systemStatisticData, systemLoanBorrowedData } = usePortfolioContext();

  const systemInterestOwnedAmount = systemLoanBorrowedData
  ? parseFloat(systemLoanBorrowedData.reduce((acc, item) => acc + item.interestOwedAmount, 0).toFixed(2))
  : 0;

  const { connectedChainAddress, isWalletConnected } = useAuthContext();
  const router = useRouter();
  const { t } = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // Add these state variables
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter transactions based on the active filter
  const filteredTransactions = systemStatisticData?.transactions.filter(tx => {
    if (activeFilter === 'All') return true;
    return tx.type === activeFilter;
  });

  // Format timestamp function
  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  useEffect(() => {
    console.log('systemLoanBorrowedData', systemLoanBorrowedData);
    // If wallet is connected, check if address is in admin list
    if (isWalletConnected) {
      const isAdmin = connectedChainAddress && AdminAddresses.includes(connectedChainAddress);
      setIsAuthorized(isAdmin);
      
      // If not admin, redirect to 404
      if (!isAdmin) {
        router.push('/404'); // or use a custom not found page
      }
    } else {
      // If wallet is not connected, set to unauthorized
      setIsAuthorized(false);
    }
  }, [connectedChainAddress, isWalletConnected, router]);

  // While checking authorization, show loading state
  if (isAuthorized === "") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">{t('lLoading')}...</div>
      </div>
    );
  }

  // If not authorized, don't render anything (will be redirected to 404)
  if (!isAuthorized) {
    return null;
  }

  // Stats card component for reuse
  const StatCard: React.FC<{ title: string; value: number | string; bgColor?: string }> = ({ title, value, bgColor = "bg-blue-500" }) => (
    <div className="bg-characterBackground1 rounded-lg shadow overflow-hidden">
      <div className={`${bgColor} p-3`}></div>
      <div className="p-4">
        <h4 className="text-neutral5 text-sm font-medium">{title}</h4>
        <p className="text-neutral1 text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
  // If authorized, show admin page content
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('lAdminDashboard')}</h1>
      
      {/* Admin overview */}
      <div className="bg-characterBackground3 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">{t('lWelcomeAdmin')}</h2>
          </div>
        </div>
        
        {/* System statistics summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard 
            title={t('lTotalWallets')} 
            value={systemStatisticData?.wallets || 0} 
            bgColor="bg-purple-500" 
          />
          <StatCard 
            title={t('lTotalOffers')} 
            value={systemStatisticData?.offers || 0} 
            bgColor="bg-blue-500" 
          />
          <StatCard 
            title={t('lActiveOffers')} 
            value={systemStatisticData?.activeOffers || 0} 
            bgColor="bg-green-500" 
          />
          <StatCard 
            title={t('lTotalLoans')} 
            value={systemStatisticData?.loans || 0} 
            bgColor="bg-yellow-500" 
          />
          <StatCard 
            title={t('lActiveLoans')} 
            value={systemStatisticData?.activeLoans || 0} 
            bgColor="bg-red-500" 
          />
        </div>
      </div>
      
      {/* Detailed sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-characterBackground3 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">{t('lSystemActivity')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-characterBackground2 pb-2">
              <span className="text-neutral5">Total Lend Fee</span>
              <span className="font-medium">
                {systemInterestOwnedAmount !== 0 ?
                  `${(systemInterestOwnedAmount) * 0.02} USDC` : 
                  '0 USDC'}
              </span>
            </div>
            <div className="flex justify-between border-b border-characterBackground2 pb-2">
              <span className="text-neutral5">Total Borrow Fee</span>
              <span className="font-medium">
                {systemInterestOwnedAmount !== 0 ?
                  `${(systemInterestOwnedAmount) * 0.02} USDC` : 
                  '0 USDC'}
              </span>
            </div>
            <div className="flex justify-between border-b border-characterBackground2 pb-2">
              <span className="text-neutral5">{t('lActiveOfferRatio')}</span>
              <span className="font-medium">
                {systemStatisticData?.offers ? 
                  `${Math.round((systemStatisticData.activeOffers / systemStatisticData.offers) * 100)}%` : 
                  '0%'}
              </span>
            </div>
            <div className="flex justify-between border-b border-characterBackground2 pb-2">
              <span className="text-neutral5">{t('lActiveLoanRatio')}</span>
              <span className="font-medium">
                {systemStatisticData?.loans ? 
                  `${Math.round((systemStatisticData.activeLoans / systemStatisticData.loans) * 100)}%` : 
                  '0%'}
              </span>
            </div>
            <div className="flex justify-between border-b border-characterBackground2 pb-2">
              <span className="text-neutral5">{t('lOffersPerWallet')}</span>
              <span className="font-medium">
                {systemStatisticData?.wallets && systemStatisticData.wallets > 0 ? 
                  (systemStatisticData.offers / systemStatisticData.wallets).toFixed(2) : 
                  '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral5">{t('lLoansPerWallet')}</span>
              <span className="font-medium">
                {systemStatisticData?.wallets && systemStatisticData.wallets > 0 ? 
                  (systemStatisticData.loans / systemStatisticData.wallets).toFixed(2) : 
                  '0'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-characterBackground3 rounded-lg p-6">
  <h3 className="font-semibold text-lg mb-4">{t('lTransactionHistory')}</h3>
  
  {/* Filter Buttons */}
  <div className="flex space-x-2 mb-4">
    <button
      onClick={() => setActiveFilter('All')}
      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
        activeFilter === 'All' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
    >
      {t('All')}
    </button>
    <button
      onClick={() => setActiveFilter('Offer')}
      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
        activeFilter === 'Offer' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
    >
      {t('Offer')}
    </button>
    <button
      onClick={() => setActiveFilter('Loan')}
      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
        activeFilter === 'Loan' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
    >
      {t('Loan')}
    </button>
  </div>
  
  <div className="bg-characterBackground2 rounded-lg p-4 w-full">
    <div className="mt-2 text-sm text-neutral5 space-y-2">
      {filteredTransactions && filteredTransactions.length > 0 ? (
        filteredTransactions
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((tx, index) => (
            <a
              key={index}
              href={`${
                process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
                  ? process.env.NEXT_PUBLIC_SUI_EXPLORER_URL
                  : addSubdomain(
                      process.env.NEXT_PUBLIC_SUI_EXPLORER_URL,
                      NetworkModeEnum.TEST_NET,
                    )
              }/txblock/${tx.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300" 
            >
              <div className="flex justify-between items-center">
                <div>
                  {tx.type} Tx: {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-6)}
                </div>
                <div className="text-xs opacity-75">
                  {formatTimestamp(tx.timestamp)}
                </div>
              </div>
            </a>
          ))
      ) : (
        <p>{t('lNoRecentTransactions')}</p>
      )}
    </div>
    {filteredTransactions && filteredTransactions.length > itemsPerPage && (
      <div className="flex justify-center mt-4 items-center space-x-4">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <ArrowLeft />
        </button>
        <span className="text-white font-semibold">{currentPage} / {Math.ceil(filteredTransactions.length / itemsPerPage)}</span>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
          disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <ArrowRight />
        </button>
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default AdminPage;