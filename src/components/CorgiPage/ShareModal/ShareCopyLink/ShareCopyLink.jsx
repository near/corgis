import React from 'react';
import PropTypes from 'prop-types';

import './ShareCopyLink.scss';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareCopyLinkPropTypes = {
  address: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
};

const ShareCopyLink = ({ address, onCopy }) => {
  const handleCopy = () => {
    onCopy();
  };

  return (
    <div className='copy-link'>
      <CopyToClipboard text={address} onCopy={() => handleCopy()}>
        <div className='copy-link__text'>
          <p className='copy-link__description'>Click to copy!</p>
          <p className='copy-link__address'>{address}</p>
        </div>
      </CopyToClipboard>
    </div>
  );
};

ShareCopyLink.propTypes = ShareCopyLinkPropTypes;

export default ShareCopyLink;
