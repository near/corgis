import React from 'react';
import PropTypes from 'prop-types';

import './CorgiRate.scss';

import classNames from 'classnames';

import { CorgiCommon, CorgiUncommon, CorgiRare, CorgiVeryRare, RarityString } from '~modules/common/corgi';

import { RATES } from '~constants/corgi';

import { CorgiType } from '~types/CorgiTypes';

const gray = '#E6E6E6';
const orange = '#FBB040';

const CorgiRatePropTypes = {
  rate: CorgiType.rate,
  responsiveRow: PropTypes.bool,
  hideTitle: PropTypes.bool,
};

const CorgiRate = ({ rate, responsiveRow = false, hideTitle = false }) => (
  <div className={classNames('corgi-rate', { 'corgi-rate--row': responsiveRow })}>
    {!hideTitle && <h3 className='corgi-rate__title'>This Corgi is:</h3>}

    <ul className='corgi-rate__list'>
      <li className='corgi-rate__item'>
        <CorgiCommon color={rate === RATES.COMMON ? orange : gray} />
        <RarityString rate={RATES.COMMON} />
      </li>

      <li className='corgi-rate__item'>
        <CorgiUncommon color={rate === RATES.UNCOMMON ? orange : gray} />
        <RarityString rate={RATES.UNCOMMON} />
      </li>

      <li className='corgi-rate__item'>
        <CorgiRare color={rate === RATES.RARE ? orange : gray} />
        <RarityString rate={RATES.RARE} />
      </li>

      <li className='corgi-rate__item'>
        <CorgiVeryRare color={rate === RATES.VERY_RARE ? orange : gray} />
        <RarityString rate={RATES.VERY_RARE} />
      </li>
    </ul>
  </div>
);

CorgiRate.propTypes = CorgiRatePropTypes;

export default CorgiRate;
