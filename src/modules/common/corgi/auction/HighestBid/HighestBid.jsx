import React from 'react';
import PropTypes from 'prop-types';

import './HighestBid.scss';

import { Owner } from '~modules/common';
import { BidAmount } from '~modules/common/corgi';

import { humanizeTime } from '~helpers/time';

import { BidTypeShape } from '~types/BidTypes';

const HighestBidPropTypes = { bid: BidTypeShape.isRequired, isExpired: PropTypes.bool };

const HighestBid = ({ bid, isExpired = false }) => {
  const { amount, bidder, timestamp } = bid;

  return (
    <div className='highest-bid'>
      {!isExpired ? (
        <>
          <h3 className='highest-bid__title'>Highest bid is</h3>

          <span className='highest-bid__info'>
            <div className='highest-bid__amount'>
              <BidAmount amount={amount} />
            </div>
            <span className='highest-bid__separator'>—</span>
            {humanizeTime(timestamp)} ago by&nbsp;
            <Owner name={bidder} />
          </span>
        </>
      ) : (
        <>
          <h3 className='highest-bid__title'>
            Winner:&nbsp;
            <Owner name={bidder} />
          </h3>
          <h3 className='highest-bid__title'>
            Bid:&nbsp;
            <div className='highest-bid__amount'>
              <BidAmount amount={amount} />
            </div>
          </h3>
        </>
      )}
    </div>
  );
};

HighestBid.propTypes = HighestBidPropTypes;

export default HighestBid;
