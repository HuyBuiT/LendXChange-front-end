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
  const { handleGetSystemStatistics } = usePortfolioContext();

  useDeepCompareEffect(() => {
    handleGetSystemStatistics();
  }, []);

  const { systemStatisticData } = usePortfolioContext();

  const { connectedChainAddress, isWalletConnected } = useAuthContext();
  const router = useRouter();
  const { t } = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    console.log('systemStatisticData', systemStatisticData);
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
  const transactions = systemStatisticData?.transactions || [];
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const currentTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
          <div className="bg-characterBackground2 rounded-lg p-4 w-full">
            <div className="mt-2 text-sm text-neutral5 space-y-2">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((tx, index) => (
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
                     {tx.type}: {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-6)}
                  </a>
                ))
              ) : (
                <p>{t('lNoRecentTransactions')}</p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 items-center space-x-4">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ArrowLeft />
                </button>
                <span className="text-white font-semibold">{currentPage} / {totalPages}</span>
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
                  disabled={currentPage === totalPages}
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