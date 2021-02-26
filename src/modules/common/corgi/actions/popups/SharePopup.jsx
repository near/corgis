import React from 'react';
import PropTypes from 'prop-types';

import { Button, PopupWrapper } from '~modules/common';
import { Share } from '~modules/common/corgi';

import { ACTION_MESSAGES } from '~constants/corgi';

import { CorgiType } from '~types/CorgiTypes';

const {
  SHARE: { POPUP_TITLE, BUTTON_DESCRIPTION },
} = ACTION_MESSAGES;

const SharePopupPropTypes = { id: CorgiType.id.isRequired, showOnlyShare: PropTypes.bool };

const SharePopup = ({ id, asButton = false }) => (
  <PopupWrapper popup={{ title: POPUP_TITLE, position: asButton ? 'top' : 'bottom-left', children: <Share id={id} /> }}>
    {asButton ? <Button description={BUTTON_DESCRIPTION} /> : <span>{BUTTON_DESCRIPTION}</span>}
  </PopupWrapper>
);

SharePopup.propTypes = SharePopupPropTypes;

export default SharePopup;
