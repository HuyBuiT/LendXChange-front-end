'use client';

import React from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import { useAppContext, usePortfolioContext } from '@/context';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { SuiSupportedTokenEnum } from '@/models';

const PortfolioPage = () => {
  const { handleGetLoansBorrowed, handleGetSuppliedAssets } = usePortfolioContext();

  useDeepCompareEffect(() => {
    handleGetLoansBorrowed();
    handleGetSuppliedAssets();
  }, []);

  const { loanBorrowedData, suppliedAssetData } = usePortfolioContext();
  const { selectedChainTokensPriceFeed } = useAppContext();

  const suiPrice = selectedChainTokensPriceFeed.get(SuiSupportedTokenEnum.SUI)?.price || 0;

  const totalBorrowed = loanBorrowedData
    ? parseFloat(loanBorrowedData.reduce((acc, item) => acc + item.borrowedAmount, 0).toFixed(2))
    : 0;

  const lendSupplied = suppliedAssetData
    ? parseFloat(suppliedAssetData.lendSupplied.reduce((acc, item) => acc + item.lendSuppliedAmount, 0).toFixed(2))
    : 0;

  const collateralSupplied = suppliedAssetData
    ? parseFloat(suppliedAssetData.collateralSupplied.reduce((acc, item) => acc + (item.collateralSuppliedAmount * suiPrice), 0).toFixed(2))
    : 0;

  const totalSupplied = parseFloat((lendSupplied + collateralSupplied).toFixed(2));
  const totalSum1 = totalBorrowed + totalSupplied; // Total for Pie Chart 1

  const interestOwnedAmount = loanBorrowedData
    ? parseFloat(loanBorrowedData.reduce((acc, item) => acc + item.interestOwedAmount, 0).toFixed(2))
    : 0;

  const interestEarnedAmount = suppliedAssetData
    ? parseFloat(suppliedAssetData.lendSupplied.reduce((acc, item) => acc + item.interestEarnedAmount, 0).toFixed(2))
    : 0;

  const totalSum2 = interestOwnedAmount + interestEarnedAmount; // Total for Pie Chart 2

  const pieChartData1 = [
    { name: 'Total Borrowed', value: totalBorrowed, percent: totalSum1 ? ((totalBorrowed / totalSum1) * 100).toFixed(2) : 0 },
    { name: 'Total Supplied', value: totalSupplied, percent: totalSum1 ? ((totalSupplied / totalSum1) * 100).toFixed(2) : 0 }
  ];
  
  const pieChartData2 = [
    { name: 'Interest Owned', value: interestOwnedAmount, percent: totalSum2 ? ((interestOwnedAmount / totalSum2) * 100).toFixed(2) : 0 },
    { name: 'Interest Earned', value: interestEarnedAmount, percent: totalSum2 ? ((interestEarnedAmount / totalSum2) * 100).toFixed(2) : 0 }
  ];

  const PIE_COLORS = ['#FF7B5C', '#31D0AA'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-2 rounded shadow-md">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm">Value: {payload[0].value}</p>
          <p className="text-sm">Percentage: {payload[0].payload.percent}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 p-6 bg-[#2E2E3E] border border-[#3A3A4C] rounded-xl shadow-lg">
      <h1 className="text-xl font-bold text-[#E0E0E0] mb-4">User Portfolio</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 p-4 bg-[#2A2A3C] border border-[#3A3A4C] rounded-xl shadow-md flex flex-col">
          <h2 className="text-lg font-semibold text-[#E0E0E0]">Total Borrowed vs. Total Supplied</h2>
          <p className="text-sm text-gray-400 mb-4">This chart shows the proportion of total borrowed assets versus total supplied assets.</p>
          <div className="flex items-start gap-6">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie data={pieChartData1} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {pieChartData1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-[#E0E0E0] space-y-2">
              {pieChartData1.map((item, index) => (
                <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-4 h-4 block rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></span>
                  <span className="text-sm">{item.name}: <strong>{item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4 bg-[#2A2A3C] border border-[#3A3A4C] rounded-xl shadow-md flex flex-col">
          <h2 className="text-lg font-semibold text-[#E0E0E0]">Interest Owned vs. Interest Earned</h2>
          <p className="text-sm text-gray-400 mb-4">This chart displays the total interest owed on borrowed assets compared to the interest earned from supplied assets.</p>
          <div className="flex items-start gap-6">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie data={pieChartData2} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {pieChartData2.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-[#E0E0E0] space-y-2">
              {pieChartData2.map((item, index) => (
                <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-4 h-4 block rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></span>
                  <span className="text-sm">{item.name}: <strong>{item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
