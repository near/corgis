import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const ButtonPropTypes = {
  action: PropTypes.func,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const Button = ({ action, description, disabled = false, badge }) => (
  <button className='button' onClick={action} disabled={disabled}>
    {description} {badge && <span className='badge bg-secondary'>{badge}</span>}
  </button>
);

Button.propTypes = ButtonPropTypes;

export default Button;
