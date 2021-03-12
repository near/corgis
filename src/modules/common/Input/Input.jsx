import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

import classNames from 'classnames';
import { v4 as uuid } from 'uuid';

import { usePrevious } from '~hooks/';

const InputPropTypes = {
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  required: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
};

const Input = ({
  autoFocus = false,
  error = '',
  label = '',
  min = '',
  max = '',
  onChange = () => {},
  placeholder = '',
  step = 'any',
  type = 'text',
  value = '',
  required = false,
  disabled = false,
}) => {
  const inputId = `input-${uuid()}`;

  const inputRef = useRef(null);

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

  useLayoutEffect(() => {
    let focusTimeoutId;

    if (autoFocus && inputRef && inputRef.current) {
      focusTimeoutId = setTimeout(() => {
        inputRef.current.focus();
        clearTimeout(focusTimeoutId);
      }, 10);
    }

    return () => {
      if (focusTimeoutId) {
        clearTimeout(focusTimeoutId);
      }
    };
  }, [inputRef]);

  return (
    <div className={classNames('input', { 'input--show-error': isErrorShown && errorMessage })}>
      {label && label.length && (
        <label className='input__label' htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        className='input__field'
        id={inputId}
        ref={inputRef}
        type={type}
        value={value}
        onChange={(event) => onChange(event)}
        min={min}
        max={max}
        step={step || 'any'}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      <p className='input__error'>{errorMessage}</p>
    </div>
  );
};

Input.propTypes = InputPropTypes;

export default Input;
