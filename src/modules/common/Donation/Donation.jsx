import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Donation.scss';

import { ContractContext } from '~contexts/contract';

import { Input, NearIcon } from '~modules/common';

import { CORGI_VALIDATION_MESSAGES } from '~constants/validation/corgi';

const DonationPropTypes = {
  label: PropTypes.string,
  afterword: PropTypes.string,
  handleNears: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showError: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

const Donation = ({
  label = 'Donate',
  afterword = '',
  min,
  value = 0,
  handleNears = () => {},
  showError = false,
  error,
  disabled = false,
}) => {
  const { mintFee } = useContext(ContractContext);

  const [nears, setNears] = useState(value);

  const [errorMessage, setErrorMessage] = useState('');

  const handleNearsInput = (event) => {
    setNears(event.target.value);

    if (nears > 0) {
      handleNears(event.target.value);
    }
  };

  useEffect(() => {
    if (min ? nears < min : nears <= mintFee) {
      setErrorMessage(error || CORGI_VALIDATION_MESSAGES.NEARS);
    }
  }, [nears]);

  useEffect(() => {
    if (errorMessage && errorMessage.length) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  useEffect(() => {
    setNears(value);
  }, [value]);

  useEffect(() => {
    if (showError) {
      setErrorMessage(error || CORGI_VALIDATION_MESSAGES.NEARS);
    }
  }, [showError]);

  return (
    <div className='donation'>
      <span className='donation__text'>{label}</span>

      <div className='donation__input'>
        <Input
          type='number'
          min={parseFloat(min || mintFee)}
          step={0.1}
          value={nears}
          onChange={handleNearsInput}
          error={errorMessage}
          disabled={disabled}
        />
      </div>

      <div className='donation__near-icon'>
        <NearIcon size='1.15em' />
      </div>

      {afterword && afterword.length && <span className='donation__text'>{afterword}</span>}
    </div>
  );
};

Donation.propTypes = DonationPropTypes;

export default Donation;
