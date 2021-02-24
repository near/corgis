import React, { useContext, useEffect, useState } from 'react';

import './Transfer.scss';

import * as nearlib from 'near-api-js';

import { ContractContext, NearContext } from '~contexts';

import { Button, Input, BasicSpinner } from '~modules/common';

import { USER_VALIDATION_MESSAGES } from '~constants/validation/account';

import { CorgiType } from '~types/CorgiTypes';

const TransferPropTypes = { id: CorgiType.id };

const Transfer = ({ id }) => {
  const { nearContent, user } = useContext(NearContext);
  const { transfering, transferCorgi } = useContext(ContractContext);

  const [receiver, setReceiver] = useState('');

  const [timeoutId, setTimeoutId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorShown, setIsErrorShown] = useState(false);

  const clearTimeoutId = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const showError = (error) => {
    setErrorMessage(error);
    setIsErrorShown(true);
  };

  const hideError = () => {
    setIsErrorShown(false);
    clearTimeoutId();
  };

  const checkAccountLegit = async (newReceiver) => {
    if (newReceiver === user.accountId) {
      showError(USER_VALIDATION_MESSAGES.OWN_ACCOUNT);
      return false;
    }

    try {
      const isAccountExist = !!(await new nearlib.Account(nearContent.connection, newReceiver).state());

      if (isAccountExist) {
        return true;
      } else {
        showError(USER_VALIDATION_MESSAGES.NOT_EXIST);
      }
    } catch (error) {
      showError(USER_VALIDATION_MESSAGES.NOT_EXIST);

      console.error(error);
    }

    return false;
  };

  const handleReceiverInput = (event) => {
    setReceiver(event.target.value);
  };

  const sendCorgi = () => {
    transferCorgi(receiver, id);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (await checkAccountLegit(receiver)) {
      sendCorgi();
    }
  };

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
    <form className='transfer' onSubmit={(event) => onSubmit(event)}>
      <div className='transfer__input'>
        <Input
          value={receiver}
          onChange={(event) => handleReceiverInput(event)}
          placeholder='account.testnet'
          type='text'
          error={errorMessage}
          showError={isErrorShown}
          required
        />
      </div>

      <div className='transfer__submit'>{!transfering ? <Button description='submit' /> : <BasicSpinner />}</div>
    </form>
  );
};

Transfer.propTypes = TransferPropTypes;

export default Transfer;
