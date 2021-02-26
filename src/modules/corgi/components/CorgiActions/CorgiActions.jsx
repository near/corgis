import React, { useContext, useEffect, useRef } from 'react';

import './CorgiActions.scss';

import { ContractContext } from '~contexts/';

import { BasicSpinner, Button, PopupWrapper } from '~modules/common';
import { Confirmation, Share, Transfer } from '~modules/common/corgi';

import { ACTION_MESSAGES } from '~constants/corgi';

import { CorgiType } from '~types/CorgiTypes';

const CorgiActionsPropTypes = {
  id: CorgiType.id.isRequired,
};

const CorgiActions = ({ id }) => {
  const { deleteCorgi, deleting } = useContext(ContractContext);

  const confirmationPopupRef = useRef();

  const onConfirm = () => {
    deleteCorgi(id);
  };

  const onReject = () => {
    if (confirmationPopupRef && confirmationPopupRef.current) {
      confirmationPopupRef.current.hidePopup();
    }
  };

  useEffect(() => {
    if (!deleting && confirmationPopupRef && confirmationPopupRef.current) {
      confirmationPopupRef.current.hidePopup();
    }
  }, [deleting, confirmationPopupRef]);

  return (
    <div className='corgi-actions'>
      <PopupWrapper
        popup={{ title: ACTION_MESSAGES.GIFT.POPUP_TITLE, position: 'top', children: <Transfer id={id} /> }}
      >
        <Button description={ACTION_MESSAGES.GIFT.BUTTON_DESCRIPTION} />
      </PopupWrapper>

      <PopupWrapper
        popup={{ title: ACTION_MESSAGES.TRADE.POPUP_TITLE, position: 'top', children: <span>In development...</span> }}
      >
        <Button description={ACTION_MESSAGES.TRADE.BUTTON_DESCRIPTION} />
      </PopupWrapper>

      <PopupWrapper popup={{ title: ACTION_MESSAGES.SHARE.POPUP_TITLE, position: 'top', children: <Share id={id} /> }}>
        <Button description={ACTION_MESSAGES.SHARE.BUTTON_DESCRIPTION} />
      </PopupWrapper>

      <PopupWrapper
        ref={confirmationPopupRef}
        popup={{
          title: !deleting ? ACTION_MESSAGES.DELETE.POPUP_TITLE : ACTION_MESSAGES.DELETE.POPUP_TITLE_ACTION_CONFIRMED,
          position: 'top',
          children: !deleting ? <Confirmation onConfirm={onConfirm} onReject={onReject} /> : <BasicSpinner />,
        }}
      >
        <Button description={ACTION_MESSAGES.DELETE.BUTTON_DESCRIPTION} danger />
      </PopupWrapper>
    </div>
  );
};

CorgiActions.propTypes = CorgiActionsPropTypes;

export default CorgiActions;
