import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './ShareModal.scss';

import { CorgiCard, Modal } from '~modules/common';
import { ShareCopyLink } from '~modules/corgi/components';

import { CorgiTypeShape } from '~types/CorgiTypes';

const ShareModalPropTypes = {
  corgi: CorgiTypeShape.isRequired,
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

const ShareModal = ({ corgi, show, closeModal }) => {
  const [isCopied, setIsCopied] = useState(false);

  const address = `${window.location.origin}/share${window.location.hash}`;

  return (
    <Modal show={show} Close={closeModal}>
      <div className='share-modal'>
        <h3>Share a Corgi</h3>
        <p>Click the card to see the share page</p>

        <div className='share-modal__corgi'>
          <CorgiCard corgi={corgi} size='small' showRarity />
        </div>

        <hr />

        <div className='share-modal__address' style={{ marginBottom: '10px' }}>
          <ShareCopyLink address={address} onCopy={() => setIsCopied(true)} />

          {isCopied && <span style={{ color: '#961be0', marginLeft: '5px' }}>Copied.</span>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <p style={{ color: '#999' }}>or share directly on</p>
          <div style={{ display: 'flex', justifyContent: 'space between' }}>
            <div className='sharethis-inline-share-buttons'></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

ShareModal.propTypes = ShareModalPropTypes;

export default ShareModal;
