'use client';

import React, { Fragment } from 'react';
import { HealthRatio } from '../common';
import { InfoHexaIcon } from '../icons';

const HealthRatioInfo: React.FC<HealthRatioInfoProps> = ({ healthRatio }) => {
  return (
    <>
      {healthRatio ? (
        <div className="flex items-center gap-x-1">
          {healthRatio <= Number(process.env.EXTREMELY_RISKY_HEALTH_RATIO) ? (
            <InfoHexaIcon className="text-error2" />
          ) : (
            <Fragment />
          )}
          <HealthRatio value={healthRatio} />
        </div>
      ) : (
        '__'
      )}
    </>
  );
};

export default HealthRatioInfo;

interface HealthRatioInfoProps extends React.ComponentPropsWithoutRef<'div'> {
  healthRatio?: number;
}
