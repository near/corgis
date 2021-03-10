import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

import classNames from 'classnames';

import { ReactChildrenType } from '~types/ReactChildrenType';

const ButtonPropTypes = {
  action: PropTypes.func,
  description: PropTypes.string,
  danger: PropTypes.bool,
  warning: PropTypes.bool,
  disabled: PropTypes.bool,
  isSquare: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stretchable: PropTypes.bool,
  children: ReactChildrenType,
};

const Button = ({
  action = () => {},
  description,
  danger = false,
  warning = false,
  disabled = false,
  isSquare = false,
  stretchable = false,
  badge,
  children,
}) => (
  <button
    className={classNames('button', {
      'button--disabled': disabled,
      'button--square': isSquare,
      'button--stretchable': stretchable,
      'button--danger': danger,
      'button--warning': warning,
    })}
    onClick={action}
    disabled={disabled}
  >
    {children || description}{' '}
    {(badge || badge === 0) && !disabled && <span className='button__badge badge'>{badge}</span>}
  </button>
);

Button.propTypes = ButtonPropTypes;

export default Button;
