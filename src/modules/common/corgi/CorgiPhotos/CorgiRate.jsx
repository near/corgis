import React from 'react';

import CorgiCommon from './CorgiCommon';
import CorgiUncommon from './CorgiUncommon';
import CorgiRare from './CorgiRare';
import CorgiVeryRare from './CorgiVeryRare';

import { RATES } from '~constants/corgi';

import { CorgiType } from '~types/CorgiTypes';

const gray = '#E6E6E6';
const orange = '#FBB040';

const CorgiRatePropTypes = { rate: CorgiType.rate };

const CorgiRate = ({ rate }) => (
  <div style={{ width: '200px' }}>
    <h5>Congrats! Your corgi is...</h5>
    <div>
      <div>
        <CorgiCommon color={rate === RATES.COMMON ? orange : gray} />
        <span>Common</span>
      </div>
      <div>
        <CorgiUncommon color={rate === RATES.UNCOMMON ? orange : gray} />
        <span>Uncommon</span>
      </div>
      <div>
        <CorgiRare color={rate === RATES.RARE ? orange : gray} />
        <span>Rare</span>
      </div>
      <div>
        <CorgiVeryRare color={rate === RATES.VERY_RARE ? orange : gray} />
        <span>Very Rare</span>
      </div>
    </div>
  </div>
);

CorgiRate.propTypes = CorgiRatePropTypes;

export default CorgiRate;
