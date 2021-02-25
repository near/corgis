import React, { useContext, useState } from 'react';

import './Transfer.scss';

import * as nearlib from 'near-api-js';

import { ContractContext, NearContext } from '~contexts';

import { CheckMarkButton, Input, BasicSpinner } from '~modules/common';

import { USER_VALIDATION_MESSAGES } from '~constants/validation/account';

import { CorgiType } from '~types/CorgiTypes';

const TransferPropTypes = { id: CorgiType.id };

const Transfer = ({ id }) => {
  const { nearContent, user } = useContext(NearContext);
  const { transfering, transferCorgi } = useContext(ContractContext);

  const [receiver, setReceiver] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const checkAccountLegit = async (newReceiver) => {
    if (newReceiver === user.accountId) {
      setErrorMessage(USER_VALIDATION_MESSAGES.OWN_ACCOUNT);
      return false;
    }

    try {
      const isAccountExist = !!(await new nearlib.Account(nearContent.connection, newReceiver).state());

      if (isAccountExist) {
        return true;
      } else {
        setErrorMessage(USER_VALIDATION_MESSAGES.NOT_EXIST);
      }
    } catch (error) {
      setErrorMessage(USER_VALIDATION_MESSAGES.NOT_EXIST);

      console.error(error);
    }

    return false;
  };

  const clearError = () => {
    setErrorMessage('');
  };

  const handleReceiverInput = (event) => {
    setReceiver(event.target.value);
    clearError();
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (await checkAccountLegit(receiver)) {
      transferCorgi(receiver, id);
    }

    clearError();
  };

  return (
    <form className='transfer' onSubmit={(event) => onSubmit(event)}>
      <div className='transfer__input'>
        <Input
          value={receiver}
          onChange={(event) => handleReceiverInput(event)}
          placeholder='account.testnet'
          type='text'
          error={errorMessage}
          required
        />
      </div>

      <div className='transfer__submit'>{!transfering ? <CheckMarkButton /> : <BasicSpinner />}</div>
    </form>
  );
};

Transfer.propTypes = TransferPropTypes;

export default Transfer;
