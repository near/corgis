import PropTypes from 'prop-types';

import { RATES } from '~constants/corgi';

export const CorgiType = {
  id: PropTypes.string,
  name: PropTypes.string,
  quote: PropTypes.string,
  color: PropTypes.string,
  background_color: PropTypes.string,
  rate: PropTypes.oneOf([RATES.COMMON, RATES.UNCOMMON, RATES.RARE, RATES.VERY_RARE]),
  owner: PropTypes.string,
  sender: PropTypes.string,
  created: PropTypes.number,
  modified: PropTypes.number,
};

export const CorgiTypeShape = PropTypes.shape(CorgiType);

export const CorgisArrayType = PropTypes.arrayOf(CorgiTypeShape);
