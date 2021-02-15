import PropTypes from 'prop-types';

import CORGI_RATES from '~constants/CorgiRates';

export const CorgiType = {
  id: PropTypes.string,
  name: PropTypes.string,
  quote: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  rate: PropTypes.oneOf([
    CORGI_RATES.COMMON,
    CORGI_RATES.UNCOMMON,
    CORGI_RATES.RARE,
    CORGI_RATES.VERY_RARE,
    CORGI_RATES.ULTRA_RARE,
  ]),
  sausage: PropTypes.string,
  sender: PropTypes.string,
  message: PropTypes.string,
};

export const CorgiTypeShape = PropTypes.shape(CorgiType);

export const CorgisArrayType = PropTypes.arrayOf(CorgiTypeShape);
