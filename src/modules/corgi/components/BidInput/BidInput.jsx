import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './BidInput.scss';

import { Input, NearIcon } from '~modules/common';

import { CORGI_VALIDATION_MESSAGES } from '~constants/validation/corgi';

const BidInputPropTypes = {
  label: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleNears: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showError: PropTypes.bool,
};

const BidInput = ({ label = 'My Bid', min = 0, value = 0, handleNears = () => {}, showError = false }) => {
  const [nears, setNears] = useState(value);

  const [errorMessage, setErrorMessage] = useState('');

  const handleNearsInput = (event) => {
    const num = event.target.value;

    // 1 Ⓝ = 1*10^24 yoctoⓃ
    // maxLength is 24 chars after dot
    const isValidLength = num.indexOf('.') !== -1 ? num.split('.')[1].length <= 24 : 24;

    if (num.indexOf('e') === -1 && isValidLength) {
      if (num && num.length) {
        handleNears(num);
      }
      setNears(num);
    }
  };

  useEffect(() => {
    if (showError && nears <= min) {
      setErrorMessage(min === 0 ? CORGI_VALIDATION_MESSAGES.NEARS : CORGI_VALIDATION_MESSAGES.BID);
    }
  }, [showError, nears, min]);

  useEffect(() => {
    if (errorMessage && errorMessage.length) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  useEffect(() => {
    setNears(value);
  }, [value]);

  return (
    <div className='bid-input'>
      <span className='bid-input__text'>{label}</span>

      <div className='bid-input__field'>
        <Input
          type='number'
          min={parseFloat(min)}
          step={0.1}
          value={nears}
          onChange={handleNearsInput}
          error={errorMessage}
        />
      </div>

      <div className='bid-input__near-icon'>
        <NearIcon size='1.15em' />
      </div>
    </div>
  );
};

BidInput.propTypes = BidInputPropTypes;

export default BidInput;
