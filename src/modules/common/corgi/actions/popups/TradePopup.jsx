import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { CorgiActionsContext, MarketplaceContext } from '~contexts';

import { Confirmation, BasicSpinner, Button, PopupWrapper } from '~modules/common';

import { ACTION_MESSAGES } from '~constants/corgi';

const { TRADE: { POPUP_TITLE, BUTTON_DESCRIPTION } } = ACTION_MESSAGES;

const TradePopupPropTypes = { asButton: PropTypes.bool };

const TradePopup = ({ asButton = false }) => {
  const { id } = useContext(CorgiActionsContext);
  const { adding, added, addCorgiForSale } = useContext(MarketplaceContext);

  const popupRef = useRef();

  const onConfirm = () => {
    addCorgiForSale(id);
  };

  const onReject = () => {
    if (popupRef && popupRef.current) {
      popupRef.current.hidePopup();
    }
  };

  useEffect(() => {
    if (added && popupRef && popupRef.current) {
      popupRef.current.hidePopup();
    }
  }, [added]);

  return (
    <PopupWrapper
      popup={{
        title: POPUP_TITLE,
        position: asButton ? 'top' : 'bottom-left',
        children: !adding ? <Confirmation onConfirm={onConfirm} onReject={onReject} /> : <BasicSpinner />,
      }}
    >
      {asButton ? <Button description={BUTTON_DESCRIPTION} /> : <span>{BUTTON_DESCRIPTION}</span>}
    </PopupWrapper>
  );
};

TradePopup.propTypes = TradePopupPropTypes;

export default TradePopup;
