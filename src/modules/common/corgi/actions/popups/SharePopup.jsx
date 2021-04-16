import React from 'react';
import PropTypes from 'prop-types';

import { Button, PopupWrapper } from '~modules/common';
import { Share } from '~modules/common/corgi';

import { ACTION_MESSAGES } from '~constants/corgi';

const { SHARE: { POPUP_TITLE, BUTTON_DESCRIPTION } } = ACTION_MESSAGES;

const SharePopupPropTypes = { asButton: PropTypes.bool };

const SharePopup = ({ asButton = false }) => (
  <PopupWrapper popup={{ title: POPUP_TITLE, position: asButton ? 'top' : 'bottom-left', children: <Share /> }}>
    {asButton ? <Button description={BUTTON_DESCRIPTION} /> : <span>{BUTTON_DESCRIPTION}</span>}
  </PopupWrapper>
);

SharePopup.propTypes = SharePopupPropTypes;

export default SharePopup;
