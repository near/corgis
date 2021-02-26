import React, { useContext, useEffect, useRef } from 'react';

import './ActionsDropdown.scss';

import { ContractContext } from '~contexts/';

import { Dropdown, PopupWrapper, BasicSpinner } from '~modules/common';
import { Confirmation, Share, Transfer } from '~modules/common/corgi';

import { ACTION_MESSAGES } from '~constants/corgi';

import { CorgiType } from '~types/CorgiTypes';

const ActionsDropdownPropTypes = { id: CorgiType.id.isRequired };

const ActionsDropdown = ({ id }) => {
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
    <Dropdown
      title={
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
          <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z' />
        </svg>
      }
      listStyles={{ left: 'auto', right: 0 }}
      hideTitleBorder
      hideArrow
      isTight
    >
      <PopupWrapper
        popup={{ title: ACTION_MESSAGES.GIFT.POPUP_TITLE, position: 'bottom-left', children: <Transfer id={id} /> }}
      >
        <span>{ACTION_MESSAGES.GIFT.BUTTON_DESCRIPTION}</span>
      </PopupWrapper>

      <PopupWrapper
        popup={{
          title: ACTION_MESSAGES.TRADE.POPUP_TITLE,
          position: 'bottom-left',
          children: <span>In development...</span>,
        }}
      >
        <span>{ACTION_MESSAGES.TRADE.BUTTON_DESCRIPTION}</span>
      </PopupWrapper>

      <PopupWrapper
        popup={{ title: ACTION_MESSAGES.SHARE.POPUP_TITLE, position: 'bottom-left', children: <Share id={id} /> }}
      >
        <span>{ACTION_MESSAGES.SHARE.BUTTON_DESCRIPTION}</span>
      </PopupWrapper>

      <span divider='true'></span>

      <PopupWrapper
        ref={confirmationPopupRef}
        popup={{
          title: !deleting ? ACTION_MESSAGES.DELETE.POPUP_TITLE : ACTION_MESSAGES.DELETE.POPUP_TITLE_ACTION_CONFIRMED,
          position: 'bottom-left',
          children: !deleting ? <Confirmation onConfirm={onConfirm} onReject={onReject} /> : <BasicSpinner />,
        }}
      >
        <span>{ACTION_MESSAGES.DELETE.BUTTON_DESCRIPTION}</span>
      </PopupWrapper>
    </Dropdown>
  );
};

ActionsDropdown.propTypes = ActionsDropdownPropTypes;

export default ActionsDropdown;
