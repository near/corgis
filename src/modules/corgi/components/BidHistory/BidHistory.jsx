import React from 'react';

import './BidHistory.scss';

import { BidTile } from '~modules/corgi/components';

import { BidsArrayType } from '~types/BidTypes';

const BidHistoryPropTypes = { bids: BidsArrayType.isRequired };

const BidHistory = ({ bids }) => (
  <div className='history'>
    <h3 className='history__title'>Bid history</h3>

    <ul className='history__list'>
      {bids.map((bid) => (
        <li className='history__item' key={bid.timestamp}>
          <BidTile bid={bid} />
        </li>
      ))}
    </ul>
  </div>
);

BidHistory.propTypes = BidHistoryPropTypes;

export default BidHistory;
