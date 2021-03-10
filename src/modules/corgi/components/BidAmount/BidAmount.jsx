import React from 'react';

import './BidAmount.scss';

import { NearIcon } from '~modules/common';

import { formatToNears } from '~helpers/nears';

import { BidType } from '~types/BidTypes';

const BidAmountPropTypes = { amount: BidType.amount.isRequired };

const BidAmount = ({ amount }) => (
  <span className='bid-amount'>
    {parseFloat(formatToNears(amount)).toFixed(1)}
    <div className='bid-amount__icon'>
      <NearIcon />
    </div>
  </span>
);

BidAmount.propTypes = BidAmountPropTypes;

export default BidAmount;
