import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { CorgiActionsContext, MarketplaceContext } from '~contexts';

import { Confirmation, BasicSpinner, Button, PopupWrapper } from '~modules/common';

import { ACTION_MESSAGES } from '~constants/corgi';

const { WITHDRAW: { POPUP_TITLE, BUTTON_DESCRIPTION } } = ACTION_MESSAGES;

const WithdrawPopupPropTypes = { asButton: PropTypes.bool };

const WithdrawPopup = ({ asButton = false }) => {
  const { id } = useContext(CorgiActionsContext);
  const { clearing, cleared, clearanceForCorgi } = useContext(MarketplaceContext);

  const popupRef = useRef();

  const onConfirm = () => {
    clearanceForCorgi(id);
  };

  const onReject = () => {
    if (popupRef && popupRef.current) {
      popupRef.current.hidePopup();
    }
  };

  useEffect(() => {
    if (cleared && popupRef && popupRef.current) {
      popupRef.current.hidePopup();
    }
  }, [cleared]);

  return (
    <PopupWrapper
      popup={{
        title: POPUP_TITLE,
        position: asButton ? 'top' : 'bottom-left',
        children: !clearing ? <Confirmation onConfirm={onConfirm} onReject={onReject} /> : <BasicSpinner />,
      }}
    >
      {asButton ? <Button description={BUTTON_DESCRIPTION} /> : <span>{BUTTON_DESCRIPTION}</span>}
    </PopupWrapper>
  );
};

WithdrawPopup.propTypes = WithdrawPopupPropTypes;

export default WithdrawPopup;
