import React from 'react';
import {
  CommonTd,
  CommonTh,
  CommonTr,
  CommonTHead,
  CommonTable,
  CommonTBody,
} from '@/components/common';

const CommonTableDemo = () => {
  return (
    <CommonTable className="w-full">
      <CommonTHead>
        <CommonTh>Amount</CommonTh>
        <CommonTh>Best offer</CommonTh>
        <CommonTh>Duration</CommonTh>
        <CommonTh>7D Volume</CommonTh>
      </CommonTHead>
      <CommonTBody>
        <CommonTr>
          <CommonTd>100 USDC</CommonTd>
          <CommonTd>3.12% </CommonTd>
          <CommonTd>14 Days</CommonTd>
          <CommonTd>$1,5 M</CommonTd>
        </CommonTr>
        <CommonTr>
          <CommonTd>100 USDC</CommonTd>
          <CommonTd>3.12% </CommonTd>
          <CommonTd>14 Days</CommonTd>
          <CommonTd>$1,5 M</CommonTd>
        </CommonTr>
        <CommonTr>
          <CommonTd>100 USDC</CommonTd>
          <CommonTd>3.12% </CommonTd>
          <CommonTd>14 Days</CommonTd>
          <CommonTd>$1,5 M</CommonTd>
        </CommonTr>
        <CommonTr>
          <CommonTd>100 USDC</CommonTd>
          <CommonTd>3.12% </CommonTd>
          <CommonTd>14 Days</CommonTd>
          <CommonTd>$1,5 M</CommonTd>
        </CommonTr>
      </CommonTBody>
    </CommonTable>
  );
};

export default CommonTableDemo;
