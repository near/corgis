import React, { useContext, useEffect } from 'react';

import './MarketplacePage.scss';

import { MarketplaceContext } from '~contexts';

import { CorgisShowCase } from '~modules/common';

import { formatToMs } from '~helpers/time';

const hasAuctionEnded = ({ for_sale: { expires } }) => (new Date()).getTime() > formatToMs(expires);

const sortCorgisAsc = ({ for_sale: { expires: expiresA } }, { for_sale: { expires: expiresB } }) => expiresA - expiresB;
const sortCorgisDes = ({ for_sale: { expires: expiresA } }, { for_sale: { expires: expiresB } }) => expiresB - expiresA;

const getCorgisForSaleSorted = (corgisForSale) => ([
  ...corgisForSale.filter((corgi) => corgi && !hasAuctionEnded(corgi)).sort(sortCorgisAsc),
  ...corgisForSale.filter((corgi) => corgi && hasAuctionEnded(corgi)).sort(sortCorgisDes),
]);

const MarketplacePage = () => {
  const { corgisForSale, getCorgisForSale } = useContext(MarketplaceContext);

  useEffect(() => {
    getCorgisForSale();
  }, []);

  return (
    <div className='marketplace'>
      <CorgisShowCase corgis={getCorgisForSaleSorted(corgisForSale)} title='For Sale' showAuctionInfo />
    </div>
  );
};

export default MarketplacePage;
