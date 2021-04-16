import PropTypes from 'prop-types';

export const ReactChildrenType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

export const ReactChildrenTypeRequired = ReactChildrenType.isRequired;
