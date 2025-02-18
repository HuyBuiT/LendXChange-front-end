'use client';

import React from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import { useAppContext, usePortfolioContext } from '@/context';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { SuiSupportedTokenEnum } from '@/models';
import { CircleArrowUp, CircleDollarSign, TrendingUp, Wallet } from 'lucide-react';

const PortfolioPage = () => {
  const { handleGetLoansBorrowed, handleGetSuppliedAssets, handleGetSystemLoansBorrowed, handleGetSystemSuppliedAssets } = usePortfolioContext();

  useDeepCompareEffect(() => {
    handleGetLoansBorrowed();
    handleGetSuppliedAssets();
    handleGetSystemLoansBorrowed();
    handleGetSystemSuppliedAssets();
  }, []);

  const { loanBorrowedData, suppliedAssetData, systemLoanBorrowedData, systemSuppliedAssetData } = usePortfolioContext();
  const { selectedChainTokensPriceFeed } = useAppContext();

  const suiPrice = selectedChainTokensPriceFeed.get(SuiSupportedTokenEnum.SUI)?.price || 0;

  // User portfolio calculations
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
  const totalSum1 = totalBorrowed + totalSupplied;

  const interestOwnedAmount = loanBorrowedData
    ? parseFloat(loanBorrowedData.reduce((acc, item) => acc + item.interestOwedAmount, 0).toFixed(2))
    : 0;

  const interestEarnedAmount = suppliedAssetData
    ? parseFloat(suppliedAssetData.lendSupplied.reduce((acc, item) => acc + item.interestEarnedAmount, 0).toFixed(2))
    : 0;

  const totalSum2 = interestOwnedAmount + interestEarnedAmount;

  // System portfolio calculations
  const systemTotalBorrowed = systemLoanBorrowedData
    ? parseFloat(systemLoanBorrowedData.reduce((acc, item) => acc + item.borrowedAmount, 0).toFixed(2))
    : 0;

  const systemLendSupplied = systemSuppliedAssetData
    ? parseFloat(systemSuppliedAssetData.lendSupplied.reduce((acc, item) => acc + item.lendSuppliedAmount, 0).toFixed(2))
    : 0;

  const systemCollateralSupplied = systemSuppliedAssetData
    ? parseFloat(systemSuppliedAssetData.collateralSupplied.reduce((acc, item) => acc + (item.collateralSuppliedAmount * suiPrice), 0).toFixed(2))
    : 0;

  const systemTotalSupplied = parseFloat((systemLendSupplied + systemCollateralSupplied).toFixed(2));
  const systemTotalSum1 = systemTotalBorrowed + systemTotalSupplied;

  const systemInterestOwnedAmount = systemLoanBorrowedData
    ? parseFloat(systemLoanBorrowedData.reduce((acc, item) => acc + item.interestOwedAmount, 0).toFixed(2))
    : 0;

  const systemInterestEarnedAmount = systemSuppliedAssetData
    ? parseFloat(systemSuppliedAssetData.lendSupplied.reduce((acc, item) => acc + item.interestEarnedAmount, 0).toFixed(2))
    : 0;

  const systemTotalSum2 = systemInterestOwnedAmount + systemInterestEarnedAmount;

  // Chart data
  const pieChartData1 = [
    { name: 'Total Borrowed', value: totalBorrowed, percent: totalSum1 ? ((totalBorrowed / totalSum1) * 100).toFixed(2) : 0 },
    { name: 'Total Supplied', value: totalSupplied, percent: totalSum1 ? ((totalSupplied / totalSum1) * 100).toFixed(2) : 0 }
  ];
  
  const pieChartData2 = [
    { name: 'Interest Owned', value: interestOwnedAmount, percent: totalSum2 ? ((interestOwnedAmount / totalSum2) * 100).toFixed(2) : 0 },
    { name: 'Interest Earned', value: interestEarnedAmount, percent: totalSum2 ? ((interestEarnedAmount / totalSum2) * 100).toFixed(2) : 0 }
  ];

  const systemPieChartData1 = [
    { name: 'Total Borrowed', value: systemTotalBorrowed, percent: systemTotalSum1 ? ((systemTotalBorrowed / systemTotalSum1) * 100).toFixed(2) : 0 },
    { name: 'Total Supplied', value: systemTotalSupplied, percent: systemTotalSum1 ? ((systemTotalSupplied / systemTotalSum1) * 100).toFixed(2) : 0 }
  ];

  const systemPieChartData2 = [
    { name: 'Interest Owned', value: systemInterestOwnedAmount, percent: systemTotalSum2 ? ((systemInterestOwnedAmount / systemTotalSum2) * 100).toFixed(2) : 0 },
    { name: 'Interest Earned', value: systemInterestEarnedAmount, percent: systemTotalSum2 ? ((systemInterestEarnedAmount / systemTotalSum2) * 100).toFixed(2) : 0 }
  ];

  const PIE_COLORS = ['#FF6B6B', '#4ECDC4'];
  const RADIAN = Math.PI / 180;

  // const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

  //   return percent > 0 ? (
  //     <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
  //       {`${Number(percent).toFixed(1)}%`}
  //     </text>
  //   ) : null;
  // };

  const renderCustomizedLabel = () => null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-800">
          <p className="text-sm font-semibold mb-1">{payload[0].name}</p>
          <p className="text-sm text-gray-300">Value: {payload[0].value.toLocaleString()}</p>
          <p className="text-sm text-gray-300">Percentage: {payload[0].payload.percent}%</p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: number; icon: any; trend?: number }) => (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gray-800 rounded-lg">
          <Icon className="w-5 h-5 text-gray-300" />
        </div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-white">{value.toLocaleString()}</span>
        {trend && (
          <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );

  const ChartCard = ({ title, description, data }: { title: string; description: string; data: any[] }) => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-400 mb-6">{description}</p>
      <div className="flex items-center justify-between">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              innerRadius={60}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }: any) => (
                <div className="flex justify-center gap-6 mt-4">
                  {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-300">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Portfolio Value" 
          value={totalSupplied + totalBorrowed}
          icon={Wallet}
          trend={2.5}
        />
        <StatCard 
          title="Total Supplied" 
          value={totalSupplied}
          icon={CircleArrowUp}
        />
        <StatCard 
          title="Total Borrowed" 
          value={totalBorrowed}
          icon={CircleDollarSign}
        />
        <StatCard 
          title="Net Interest" 
          value={interestEarnedAmount - interestOwnedAmount}
          icon={TrendingUp}
          trend={interestEarnedAmount > interestOwnedAmount ? 1.2 : -1.2}
        />
      </div>

      {/* User Portfolio Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">User Portfolio</h1>
          <div className="flex gap-2">
            <span className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Assets Distribution"
            description="Distribution of borrowed vs supplied assets in your portfolio"
            data={pieChartData1}
          />
          <ChartCard
            title="Interest Overview"
            description="Comparison of interest earned vs interest owed"
            data={pieChartData2}
          />
        </div>
      </section>

      {/* System Portfolio Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">System Portfolio</h1>
          <div className="flex gap-2">
            <span className="text-sm text-gray-400">System-wide metrics</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="System Assets Distribution"
            description="System-wide distribution of borrowed vs supplied assets"
            data={systemPieChartData1}
          />
          <ChartCard
            title="System Interest Overview"
            description="System-wide comparison of interest earned vs interest owed"
            data={systemPieChartData2}
          />
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;