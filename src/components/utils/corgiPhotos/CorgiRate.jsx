import React from 'react';
import { CorgiType } from '../../../types/CorgiTypes';

import Common from './Common';
import Uncommon from './Uncommon';
import Rare from './Rare';
import VeryRare from './VeryRare';

const gray = '#E6E6E6';
const orange = '#FBB040';

const CorgiRatePropTypes = {
  rate: CorgiType.rate,
};

const CorgiRate = ({ rate }) => (
  <div style={{ width: '200px' }}>
    <h5>Congrats! Your corgi is...</h5>
    <div>
      <div>
        <Common color={rate === 'COMMON' ? orange : gray} />
        <span>Common</span>
      </div>
      <div>
        <Uncommon color={rate === 'UNCOMMON' ? orange : gray} />
        <span>Uncommon</span>
      </div>
      <div>
        <Rare color={rate === 'RARE' ? orange : gray} />
        <span>Rare</span>
      </div>
      <div>
        <VeryRare color={rate === 'VERY RARE' ? orange : gray} />
        <span>Very Rare</span>
      </div>
    </div>
  </div>
);

CorgiRate.propTypes = CorgiRatePropTypes;

export default CorgiRate;
