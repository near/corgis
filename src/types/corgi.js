import PropTypes from 'prop-types';

export const CorgiType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  quote: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  rate: PropTypes.string.isRequired,
  sausage: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
});

export const CorgisArrayType = PropTypes.arrayOf(CorgiType);
