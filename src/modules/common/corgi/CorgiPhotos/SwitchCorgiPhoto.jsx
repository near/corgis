import React from 'react';

import CorgiCommon from './CorgiCommon';
import CorgiUncommon from './CorgiUncommon';
import CorgiRare from './CorgiRare';
import CorgiVeryRare from './CorgiVeryRare';

import { RATES } from '~constants/corgi';

import { CorgiType } from '~types/CorgiTypes';

const SwitchCorgiPhotoPropTypes = {
  rate: CorgiType.rate,
  color: CorgiType.color,
};

const SwitchCorgiPhoto = ({ rate, color }) => {
  switch (rate) {
    case RATES.COMMON:
      return <CorgiCommon color={color} />;

    case RATES.UNCOMMON:
      return <CorgiUncommon color={color} />;

    case RATES.RARE:
      return <CorgiRare color={color} />;

    case RATES.VERY_RARE:
      return <CorgiVeryRare color={color} />;

    default:
      return <CorgiCommon color={color} />;
  }
};

SwitchCorgiPhoto.propTypes = SwitchCorgiPhotoPropTypes;

export default SwitchCorgiPhoto;
