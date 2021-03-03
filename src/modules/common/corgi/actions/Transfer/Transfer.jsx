import React, { useContext, useState } from 'react';

import './Transfer.scss';

import { ContractContext, NearContext } from '~contexts';

import { CheckMarkButton, Input, BasicSpinner } from '~modules/common';

import { USER_VALIDATION_MESSAGES } from '~constants/validation/account';

import { CorgiType } from '~types/CorgiTypes';
import checkAccountLegit from '~helpers/checkAccountLegit';

const TransferPropTypes = { id: CorgiType.id.isRequired };

const Transfer = ({ id }) => {
  const { nearContent, user } = useContext(NearContext);
  const { transfering, transferCorgi } = useContext(ContractContext);

  const [receiver, setReceiver] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const checkAccount = async (newReceiver) => {
    if (newReceiver === user.accountId) {
      setErrorMessage(USER_VALIDATION_MESSAGES.OWN_ACCOUNT);
      return false;
    }

    if (await checkAccountLegit(newReceiver, nearContent.connection)) {
      return true;
    } else {
      setErrorMessage(USER_VALIDATION_MESSAGES.NOT_EXIST);
      return false;
    }
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

    clearError();

    if (await checkAccount(receiver)) {
      transferCorgi(receiver, id);
    }
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
          autoFocus
          required
        />
      </div>

      <div className='transfer__submit'>{!transfering ? <CheckMarkButton /> : <BasicSpinner />}</div>
    </form>
  );
};

Transfer.propTypes = TransferPropTypes;

export default Transfer;
