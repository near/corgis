import React from 'react';
import PropTypes from 'prop-types';

import { SmallCard } from '../../CorgiCard/Card';
import Modal from '../../utils/Modal';

import Transfer from './Transafer/Transfer';
import { CorgiThree } from '../../utils/corgiAnimation';

import { CorgiType } from '../../../types/corgi';

const Send = ({ corgi, show, closeModal, transfering }) => (
  <Modal show={show} Close={closeModal}>
    {!transfering ? (
      <div style={{ width: '100%', height: '100%' }}>
        <h3>Send a Corgi</h3>
        <div>
          <div style={{ width: '100%', height: '90%' }}>
            <SmallCard
              backgroundColor={corgi.backgroundColor}
              color={corgi.color}
              sausage={corgi.sausage}
              quote={corgi.quote}
            />
          </div>
          <p style={{ margin: '0' }}>{corgi.name}</p>
          <span style={{ color: 'orange', fontSize: '0.7rem' }}>{corgi.rate}</span>
          <hr />
        </div>
        <Transfer />
      </div>
    ) : (
      <div className='box'>
        <CorgiThree color={corgi.color} />
        <style>{`
            .box {

              padding-top: 30px;
              animation-name: spin;
              animation-duration: 1000ms;
              animation-iteration-count: infinite;
              animation-timing-function: linear; 
            }
            @keyframes spin {
              from {
                  transform:rotate(0deg);
              }
              to {
                  transform:rotate(360deg);
              }
            }
          `}</style>
      </div>
    )}
  </Modal>
);

Send.propTypes = {
  corgi: CorgiType.isRequired,
  show: PropTypes.boolean.isRequired,
  closeModal: PropTypes.func.isRequired,
  transfering: PropTypes.boolean.isRequired,
};

export default Send;
