import React from 'react';

import CorgiCommon from './CorgiCommon';
import CorgiUncommon from './CorgiUncommon';
import CorgiRare from './CorgiRare';
import CorgiVeryRare from './CorgiVeryRare';

import { CorgiType } from '~types/CorgiTypes';

const SwitchCorgiPhotoPropTypes = {
  rate: CorgiType.rate,
  color: CorgiType.color,
};

const SwitchCorgiPhoto = ({ rate, color }) => {
  switch (rate) {
    case 'COMMON':
      return <CorgiCommon color={color} />;

    case 'UNCOMMON':
      return <CorgiUncommon color={color} />;

    case 'RARE':
      return <CorgiRare color={color} />;

    case 'VERY RARE':
      return <CorgiVeryRare color={color} />;

    case 'ULTRA RARE':
      return 'ULTRA RARE';

    default:
      return <CorgiCommon color={color} />;
  }
};

SwitchCorgiPhoto.propTypes = SwitchCorgiPhotoPropTypes;

export default SwitchCorgiPhoto;
