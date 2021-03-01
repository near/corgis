import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

import classNames from 'classnames';

import { usePrevious } from '~hooks/';

const InputPropTypes = {
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const Input = ({
  autoFocus = false,
  error = '',
  onChange = () => {},
  placeholder = '',
  type = 'text',
  value = '',
  required = false,
}) => {
  const prevValue = usePrevious(value);

  const [timeoutId, setTimeoutId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorShown, setIsErrorShown] = useState(false);

  const clearTimeoutId = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const hideError = () => {
    setIsErrorShown(false);
    clearTimeoutId();
  };

  useEffect(() => {
    if (value !== prevValue) {
      hideError();
    }
  }, [value, prevValue]);

  useEffect(() => {
    setIsErrorShown(true);

    if (error && error.length) {
      setErrorMessage(error);
    } else {
      clearTimeoutId();
    }
  }, [error]);

  useEffect(() => {
    if (!timeoutId && isErrorShown) {
      setTimeoutId(
        setTimeout(() => {
          hideError();
        }, 5000),
      );
    }

    return () => {
      clearTimeoutId();
    };
  }, [timeoutId, isErrorShown, setTimeoutId, setIsErrorShown]);

  useEffect(() => {
    if (!timeoutId && !isErrorShown && errorMessage && errorMessage.length) {
      setTimeoutId(
        setTimeout(() => {
          setErrorMessage('');

          clearTimeoutId();
        }, 1000),
      );
    }

    return () => {
      clearTimeoutId();
    };
  }, [timeoutId, isErrorShown, errorMessage, setTimeoutId, setErrorMessage]);

  return (
    <div className='input' className={classNames('input', { 'input--show-error': isErrorShown && errorMessage })}>
      <input
        className='input__field'
        type={type}
        value={value}
        onChange={(event) => onChange(event)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
      />
      <p className='input__error'>{errorMessage}</p>
    </div>
  );
};

Input.propTypes = InputPropTypes;

export default Input;
