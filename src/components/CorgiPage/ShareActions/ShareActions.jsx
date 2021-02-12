import React from 'react';
import PropTypes from 'prop-types';

import './ShareActions.scss';

import iconSend from '../../../assets/images/icon-send.svg';
import iconShare from '../../../assets/images/icon-share.svg';

import ShareCard from './ShareCard/ShareCard';

const SharePropTypesActions = {
  openShareModal: PropTypes.func.isRequired,
  openSendModal: PropTypes.func.isRequired,
};

const ShareActions = ({ openShareModal, openSendModal }) => (
  <div className='share-actions'>
    <h5 className='share-actions__title'>What would you like to do with </h5>

    <div className='share-actions__cards'>
      <ShareCard
        onClick={openSendModal}
        icon={iconSend}
        iconAlt='Send'
        title='Send as a gift'
        description='The perfect gift for any occasion'
      />

      <ShareCard
        onClick={openShareModal}
        icon={iconShare}
        iconAlt='Share'
        title='Share on Social'
        description='Got something rare? It is time to brag a bit.'
      />
    </div>
  </div>
);

ShareActions.propTypes = SharePropTypesActions;

export default ShareActions;
