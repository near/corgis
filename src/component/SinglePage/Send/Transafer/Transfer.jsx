import React, { useContext } from 'react';
import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io';

import * as nearlib from 'near-api-js';

import { NearContext } from '../../../../context/NearContext';
import { ContractContext } from '../../../../context/contract';
import { TransferContext } from '../../../../context/transfer';

import Button from '../../../utils/Button';

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

    if (!!isAccountLegit) {
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
    <div>
      <form onSubmit={onSubmit}>
        <div style={{ textAlign: 'left', marginBottom: '3px' }}>
          <label>To: </label>
          <input
            autoFocus
            required
            type='text'
            placeholder='Corgi receiver'
            value={transferContext.receiver}
            onChange={setReceiver}
            className='receiver'
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
        <div style={{ textAlign: 'left' }}>
          <label>Text: </label>
          <textarea
            placeholder='(Optional)Best wish to your friend!'
            maxLength={140}
            value={transferContext.message}
            onChange={setMessage}
            className='message'
          />
        </div>
        <div style={{ marginTop: '5px', marginBottom: '10px' }}>
          <Button description='Send' disabled={!transferContext.found} />
        </div>
      </form>
      <style>{`
        .receiver {
          display: inline;
          margin-left: 5px;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0;0;0;0.50);
          border-radius: 5px;
          color: #4A4F54;
          letterspacing: 0;
          text-align: start;
          width: 60%;
        }
        .message {
          display: inline;
          margin-left: 5px;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0;0;0;0.50);
          borderradius: 5px;
          color: #4A4F54;
          letter-spacing: 0;
          text-align: start;
          width: 80%;
        };
      `}</style>
    </div>
  );
};

export default Transfer;
