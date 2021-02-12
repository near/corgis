import React from 'react';

import CorgiCommon from './CorgiCommon';
import CorgiUncommon from './CorgiUncommon';
import CorgiRare from './CorgiRare';
import CorgiVeryRare from './CorgiVeryRare';

import { CorgiType } from '~types/CorgiTypes';

const gray = '#E6E6E6';
const orange = '#FBB040';

const CorgiRatePropTypes = { rate: CorgiType.rate };

const CorgiRate = ({ rate }) => (
  <div style={{ width: '200px' }}>
    <h5>Congrats! Your corgi is...</h5>
    <div>
      <div>
        <CorgiCommon color={rate === 'COMMON' ? orange : gray} />
        <span>Common</span>
      </div>
      <div>
        <CorgiUncommon color={rate === 'UNCOMMON' ? orange : gray} />
        <span>Uncommon</span>
      </div>
      <div>
        <CorgiRare color={rate === 'RARE' ? orange : gray} />
        <span>Rare</span>
      </div>
      <div>
        <CorgiVeryRare color={rate === 'VERY RARE' ? orange : gray} />
        <span>Very Rare</span>
      </div>
    </div>
  </div>
);

CorgiRate.propTypes = CorgiRatePropTypes;

export default CorgiRate;
