import React, { useContext, useEffect, useState } from 'react';

import './GenerationForm.scss';

import { GiGreekSphinx, GiBeachBall } from 'react-icons/gi';

import classNames from 'classnames';
import randomColor from 'randomcolor';

import { CharacterContext } from '~context/character';
import { ContractContext } from '~context/contract';

import { Button, Colorpicker, Input } from '~modules/common';

import { genRandomName } from '~helpers/generators';

import { CORGI_VALIDATION_MESSAGES } from '~constants/validation/corgi';

import { validateCorgiName } from '~validators';

const GenerationForm = () => {
  const { createCorgi } = useContext(ContractContext);
  const { name, quote, color, backgroundColor, setName, setColor, setBackgroundColor } = useContext(CharacterContext);

  const [timeoutId, setTimeoutId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const clearTimeoutId = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const hideError = () => {
    setShowError(false);
    clearTimeoutId();
  };

  const handleName = (event) => {
    setName(event.target.value);

    if (showError) {
      hideError();
    }
  };

  const generateRandomName = () => {
    setName(genRandomName());
  };

  const handleColor = (newColor) => {
    setColor(newColor);
  };

  const handleBackgroundColor = (newColor) => {
    setBackgroundColor(newColor);
  };

  const generateRandomColor = () => {
    setColor(randomColor());
    setBackgroundColor(randomColor());
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const validationMessage = validateCorgiName(name);

    if (validationMessage === CORGI_VALIDATION_MESSAGES.SUCCESS) {
      createCorgi(name, color, backgroundColor, quote);

      hideError();
    } else {
      setErrorMessage(validationMessage);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (!timeoutId && showError) {
      setTimeoutId(
        setTimeout(() => {
          hideError();
        }, 5000),
      );
    }

    return () => {
      clearTimeoutId();
    };
  }, [timeoutId, showError, setTimeoutId, setShowError]);

  useEffect(() => {
    if (!timeoutId && !showError && errorMessage && errorMessage.length) {
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
  }, [timeoutId, showError, errorMessage, setTimeoutId, setErrorMessage]);

  return (
    <form className='generation-form' onSubmit={(event) => onSubmit(event)}>
      <p className='generation-form__title'>My Corgi is called</p>

      <div className={classNames('generation-form__area', 'generation-form__name')}>
        <div className='generation-form__input'>
          <Input
            type='text'
            value={name}
            onChange={handleName}
            placeholder='Sweet Corgi'
            error={errorMessage}
            showError={showError}
            required
          />
        </div>

        <GiGreekSphinx onClick={() => generateRandomName()} className='generation-form__icon' />
      </div>

      <p className='generation-form__title'>Colors</p>

      <div className={classNames('generation-form__area', 'generation-form__colors')}>
        <div className='generation-form__colorpickers'>
          <div className='generation-form__colorpicker'>
            <Colorpicker title={'Corgi'} color={color} pickColor={handleColor} />
          </div>

          <div className='generation-form__colorpicker'>
            <Colorpicker title={'Background'} color={backgroundColor} pickColor={handleBackgroundColor} />
          </div>
        </div>

        <GiBeachBall onClick={() => generateRandomColor()} className='generation-form__icon' />
      </div>
      <Button description='Generate Corgi' />
    </form>
  );
};

export default GenerationForm;
