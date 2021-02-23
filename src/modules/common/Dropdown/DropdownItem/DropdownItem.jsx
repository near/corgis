import React from 'react';
import PropTypes from 'prop-types';

import './DropdownItem.scss';

import classNames from 'classnames';

const DropdownItemPropTypes = {
  children: PropTypes.node.isRequired,
  isDivider: PropTypes.bool,
};

const DropdownItem = ({ children, isDivider = false }) => {
  return <li className={classNames('dropdown-item', { 'dropdown-item--divider': isDivider })}>{children}</li>;
};

DropdownItem.propTypes = DropdownItemPropTypes;

export default DropdownItem;
