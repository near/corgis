import React, { useContext } from 'react';

import './Transfer.scss';

import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io';

import * as nearlib from 'near-api-js';

import { ContractContext, NearContext, TransferContext } from '~contexts';

import { Button } from '~modules/common';

const Transfer = () => {
  const { nearContent } = useContext(NearContext);
  const { transferCorgi } = useContext(ContractContext);
  const transferContext = useContext(TransferContext);

  const id = window.location.hash.slice(1);

  const checkAccountLegit = async (value) => {
    try {
      const isAccountFound = !!(await new nearlib.Account(nearContent.connection, value).state());

      if (isAccountFound) {
        transferContext.foundReceiverSuccess();
        return true;
      }
    } catch (error) {
      transferContext.foundReceiverError(error.message);
    }

    return false;
  };

  const setReceiver = async (event) => {
    const newReceiver = event.target.value;

    const isAccountLegit = await checkAccountLegit(newReceiver);

    if (isAccountLegit) {
      transferContext.setReceiver(newReceiver);
    }
  };

  const setMessage = (event) => {
    transferContext.setMessage(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    transferCorgi(transferContext.receiver, id, transferContext.message);
  };

  return (
    <form className='transfer' onSubmit={(event) => onSubmit(event)}>
      <div className='transfer__input-field'>
        <label>To: </label>
        <input
          autoFocus
          required
          type='text'
          placeholder='Corgi receiver'
          value={transferContext.receiver}
          onChange={setReceiver}
          className='transfer__receiver'
        />
        {transferContext.found ? (
          <label>
            <IoIosCheckmarkCircleOutline
              style={{
                position: 'relative',
                left: '-30px',
                fontSize: '1.5rem',
                color: '#78e3a7',
              }}
            />
          </label>
        ) : (
          <label>
            <IoIosCloseCircleOutline
              style={{
                position: 'relative',
                left: '-30px',
                fontSize: '1.5rem',
                color: 'Salmon',
              }}
            />
          </label>
        )}
      </div>
      <div className='transfer__input-field' style={{ textAlign: 'left' }}>
        <label>Text: </label>
        <textarea
          className='transfer__message'
          placeholder='(Optional)Best wish to your friend!'
          maxLength={140}
          value={transferContext.message}
          onChange={setMessage}
        />
      </div>

      <div className='transfer__submit'>
        <Button description='Send' disabled={!transferContext.found} />
      </div>
    </form>
  );
};

export default Transfer;
