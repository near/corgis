import React from 'react';
import PropTypes from 'prop-types';

import './BidAmount.scss';

import { NearIcon } from '~modules/common';

import { formatToNears } from '~helpers/nears';

import { BidType } from '~types/BidTypes';

const BidAmountPropTypes = { amount: BidType.amount.isRequired, trim: PropTypes.bool };

const BidAmount = ({ amount, trim = false }) => {
  const nears = formatToNears(amount);

  // match float number as string to trim zeros in center
  const matched = nears.match(/(\d*)0\.\d*?([^0])/);

  const trimmed = matched && matched[0] && (matched[0].length <= 6 ? `${matched[0]}` : `${matched[0].split('.')[0]}.0`);

  return (
    <span className='bid-amount'>
      <div className='bid-amount__info'>
        {trim && nears.length > 6 ? (
          <>
            <span className='bid-amount__number'>{nears.indexOf('.') !== -1 ? trimmed : nears.slice(0, 5)}...</span>
            <div className='bid-amount__popup'>
              <span className='bid-amount__number'>{nears}</span>
              <div className='bid-amount__icon'>
                <NearIcon />
              </div>
            </div>
          </>
        ) : (
          <span className='bid-amount__number'>{nears}</span>
        )}
      </div>
      <div className='bid-amount__icon'>
        <NearIcon />
      </div>
    </span>
  );
};

BidAmount.propTypes = BidAmountPropTypes;

export default BidAmount;
