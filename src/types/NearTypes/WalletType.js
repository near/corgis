import PropTypes from 'prop-types';

export const WalletType = { requestSignIn: PropTypes.func.isRequired, signOut: PropTypes.func.isRequired };

export const WalletTypeShape = PropTypes.shape(WalletType);
