import PropTypes from 'prop-types';

export const BidType = {
  amount: PropTypes.string,
  bidder: PropTypes.string,
  timestamp: PropTypes.string,
};

export const BidTypeShape = PropTypes.shape(BidType);

export const BidsArrayType = PropTypes.arrayOf(BidTypeShape);
