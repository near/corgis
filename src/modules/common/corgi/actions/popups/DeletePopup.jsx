import React from 'react';
import PropTypes from 'prop-types';

import { BasicSpinner, Button, PopupWrapper } from '~modules/common';
import { Confirmation } from '~modules/common/corgi';

import { ACTION_MESSAGES } from '~constants/corgi';

const {
  DELETE: { POPUP_TITLE, POPUP_TITLE_ACTION_CONFIRMED, BUTTON_DESCRIPTION },
} = ACTION_MESSAGES;

const DeletePopupPropTypes = {
  deleting: PropTypes.bool,
  onConfirm: PropTypes.func,
  onReject: PropTypes.func,
  asButton: PropTypes.bool,
};

const DeletePopup = React.forwardRef(
  ({ deleting = false, onConfirm = () => {}, onReject = () => {}, asButton = false }, ref) => (
    <PopupWrapper
      ref={ref}
      popup={{
        title: !deleting ? POPUP_TITLE : POPUP_TITLE_ACTION_CONFIRMED,
        position: asButton ? 'top' : 'bottom-left',
        children: !deleting ? <Confirmation onConfirm={onConfirm} onReject={onReject} /> : <BasicSpinner />,
      }}
    >
      {asButton ? <Button description={BUTTON_DESCRIPTION} danger /> : <span>{BUTTON_DESCRIPTION}</span>}
    </PopupWrapper>
  ),
);

DeletePopup.propTypes = DeletePopupPropTypes;

export default DeletePopup;
