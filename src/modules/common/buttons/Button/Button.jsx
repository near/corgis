import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

import classNames from 'classnames';

import { ReactChildrenType } from '~types/ReactChildrenType';

const ButtonPropTypes = {
  action: PropTypes.func,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  isSquare: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: ReactChildrenType,
};

const Button = ({ action = () => {}, description, disabled = false, isSquare = false, badge, children }) => (
  <button
    className={classNames('button', { 'button--disabled': disabled, 'button--square': isSquare })}
    onClick={action}
    disabled={disabled}
  >
    {children || description} {(badge || badge === 0) && !disabled && <span className='button__badge badge'>{badge}</span>}
  </button>
);

Button.propTypes = ButtonPropTypes;

export default Button;
