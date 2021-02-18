import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

import classNames from 'classnames';

const InputPropTypes = {
  error: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showError: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const Input = ({
  error = '',
  onChange = () => {},
  placeholder = '',
  showError = false,
  type = 'text',
  value = '',
  required = false,
}) => (
  <div className='input' className={classNames('input', { 'input--show-error': showError && error.length })}>
    <input
      className='input__field'
      type={type}
      value={value}
      onChange={(event) => onChange(event)}
      placeholder={placeholder}
      required={required}
    />
    <p className='input__error'>{error}</p>
  </div>
);

Input.propTypes = InputPropTypes;

export default Input;
