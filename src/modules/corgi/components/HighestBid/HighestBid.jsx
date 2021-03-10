import React from 'react';

import * as nearAPI from 'near-api-js';

import './HighestBid.scss';

import { NearIcon, Owner } from '~modules/common';

import { BidTypeShape } from '~types/BidTypes';
import { humanizeTime } from '~helpers/time';
import { BidAmount } from '~modules/corgi/components';

const HighestBidPropTypes = { bid: BidTypeShape.isRequired };

const HighestBid = ({ bid }) => {
  const { amount, bidder, timestamp } = bid;

  return (
    <div className='highest-bid'>
      <h3 className='highest-bid__title'>Highest bid is</h3>

      <span className='highest-bid__info'>
        <div className='highest-bid__amount'>
          <BidAmount amount={amount} />
        </div>
        <span className='highest-bid__separator'>—</span>
        {humanizeTime(timestamp)} ago by&nbsp;<Owner name={bidder} />
      </span>
    </div>
  );
};

HighestBid.propTypes = HighestBidPropTypes;

export default HighestBid;
