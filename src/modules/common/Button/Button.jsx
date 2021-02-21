import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

import classNames from 'classnames';

const ButtonPropTypes = {
  action: PropTypes.func,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const Button = ({ action, description, disabled = false, badge }) => (
  <button className={classNames('button', { 'button--disabled': disabled })} onClick={action} disabled={disabled}>
    {description} {(badge || badge === 0) && !disabled && <span className='button__badge badge'>{badge}</span>}
  </button>
);

Button.propTypes = ButtonPropTypes;

export default Button;
