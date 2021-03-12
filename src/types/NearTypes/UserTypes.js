import PropTypes from 'prop-types';

export const UserType = { accountId: PropTypes.string.isRequired, balance: PropTypes.string.isRequired };

export const UserTypeShape = PropTypes.shape(UserType);
