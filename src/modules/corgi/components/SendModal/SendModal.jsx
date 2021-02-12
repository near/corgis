import React from 'react';
import PropTypes from 'prop-types';

import './SendModal.scss';

import classNames from 'classnames';

import { CorgiAnimThree, CorgiCard, Modal } from '~modules/common';
import { Transfer } from '~modules/corgi/components';

import { CorgiTypeShape } from '~types/CorgiTypes';

const SendModalPropTypes = {
  corgi: CorgiTypeShape.isRequired,
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  transfering: PropTypes.bool.isRequired,
};

const SendModal = ({ corgi, show, closeModal, transfering }) => (
  <Modal show={show} Close={closeModal}>
    <div className={classNames('send-modal', { 'send-modal--transfering': transfering })}>
      {!transfering ? (
        <>
          <h3>Send a Corgi</h3>

          <div className='send-modal__corgi'>
            <CorgiCard corgi={corgi} size='small' />

            <p>{corgi.name}</p>
            <span style={{ color: 'orange', fontSize: '0.7rem' }}>{corgi.rate}</span>
            <hr />
          </div>

          <Transfer />
        </>
      ) : (
        <CorgiAnimThree color={corgi.color} />
      )}
    </div>
  </Modal>
);

SendModal.propTypes = SendModalPropTypes;

export default SendModal;
