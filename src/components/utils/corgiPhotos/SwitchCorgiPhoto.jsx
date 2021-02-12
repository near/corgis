import React from 'react';
import { CorgiType } from '../../../types/CorgiTypes';

import Common from './Common';
import Uncommon from './Uncommon';
import Rare from './Rare';
import VeryRare from './VeryRare';

const SwitchCorgiPhotoPropTypes = {
  rate: CorgiType.rate,
  color: CorgiType.color,
};

const SwitchCorgiPhoto = ({ rate, color }) => {
  switch (rate) {
    case 'COMMON':
      return <Common color={color} />;

    case 'UNCOMMON':
      return <Uncommon color={color} />;

    case 'RARE':
      return <Rare color={color} />;

    case 'VERY RARE':
      return <VeryRare color={color} />;

    case 'ULTRA RARE':
      return 'ULTRA RARE';

    default:
      return <Common color={color} />;
  }
};

SwitchCorgiPhoto.propTypes = SwitchCorgiPhotoPropTypes;

export default SwitchCorgiPhoto;
