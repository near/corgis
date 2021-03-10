import React, { useContext, useEffect } from 'react';

import './MarketplacePage.scss';

import { MarketplaceContext } from '~contexts';

import { CorgisShowCase } from '~modules/common';

const MarketplacePage = () => {
  const { corgisForSale, getCorgisForSale } = useContext(MarketplaceContext);

  useEffect(() => {
    getCorgisForSale();
  }, []);

  return (
    <div className='marketplace'>
      <CorgisShowCase corgis={corgisForSale} title='For Sale' />
    </div>
  );
};

export default MarketplacePage;
