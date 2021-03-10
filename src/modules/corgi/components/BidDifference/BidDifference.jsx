import React from 'react';
import PropTypes from 'prop-types';

import './BidDifference.scss';

import { NearIcon } from '~modules/common';

const BidDifferencePropTypes = {
  existed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const format = (amount) => parseFloat(amount).toFixed(1);

const BidDifference = ({ existed, bid }) => (
  <>
    {bid - existed !== 0 ? (
      <div className='difference'>
        <span className='difference__text'>
          To bid {format(bid)}
          <i className='difference__near-icon'>
            <NearIcon />
          </i>
          &nbsp;
        </span>

        <span className='difference__text'>
          you will need to pay {format(bid - existed)}
          <i className='difference__near-icon'>
            <NearIcon />
          </i>
          .&nbsp;
        </span>

        <span className='difference__text'>
          Your last bid was {format(existed)}
          <i className='difference__near-icon'>
            <NearIcon />
          </i>
          .
        </span>
      </div>
    ) : (
      <></>
    )}
  </>
);

BidDifference.propTypes = BidDifferencePropTypes;

export default BidDifference;
