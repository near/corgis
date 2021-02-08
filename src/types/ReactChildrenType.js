import PropTypes from 'prop-types';

const ReactChildrenType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired;

export default ReactChildrenType;
