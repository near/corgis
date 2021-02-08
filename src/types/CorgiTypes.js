import PropTypes from 'prop-types';

export const CorgiType = {
  id: PropTypes.string,
  name: PropTypes.string,
  quote: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  rate: PropTypes.string,
  sausage: PropTypes.string,
  sender: PropTypes.string,
  message: PropTypes.string,
};

export const CorgiTypeShape = PropTypes.shape(CorgiType);

export const CorgisArrayType = PropTypes.arrayOf(CorgiTypeShape);
