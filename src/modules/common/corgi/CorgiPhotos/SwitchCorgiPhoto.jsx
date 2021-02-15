import React from 'react';

import CorgiCommon from './CorgiCommon';
import CorgiUncommon from './CorgiUncommon';
import CorgiRare from './CorgiRare';
import CorgiVeryRare from './CorgiVeryRare';

import CORGI_RATES from '~constants/CorgiRates';

import { CorgiType } from '~types/CorgiTypes';

const SwitchCorgiPhotoPropTypes = {
  rate: CorgiType.rate,
  color: CorgiType.color,
};

const SwitchCorgiPhoto = ({ rate, color }) => {
  switch (rate) {
    case CORGI_RATES.COMMON:
      return <CorgiCommon color={color} />;

    case CORGI_RATES.UNCOMMON:
      return <CorgiUncommon color={color} />;

    case CORGI_RATES.RARE:
      return <CorgiRare color={color} />;

    case CORGI_RATES.VERY_RARE:
      return <CorgiVeryRare color={color} />;

    case CORGI_RATES.ULTRA_RARE:
      return 'ULTRA RARE';

    default:
      return <CorgiCommon color={color} />;
  }
};

SwitchCorgiPhoto.propTypes = SwitchCorgiPhotoPropTypes;

export default SwitchCorgiPhoto;
