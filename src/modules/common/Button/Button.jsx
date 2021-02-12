import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const ButtonPropTypes = {
  action: PropTypes.func,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

const Button = ({ action, description, disabled = false }) => (
  <button className='button' onClick={action} disabled={disabled}>
    {description}
  </button>
);

Button.propTypes = ButtonPropTypes;

export default Button;
