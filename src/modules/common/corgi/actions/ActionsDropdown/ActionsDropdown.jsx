import React, { useContext, useEffect, useRef } from 'react';

import './ActionsDropdown.scss';

import { ContractContext } from '~contexts/';

import { Dropdown, PopupWrapper, BasicSpinner } from '~modules/common';
import { Confirmation, Share, Transfer } from '~modules/common/corgi';

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
    >
      <PopupWrapper
        popup={{ title: 'Gift me to your friend!', position: 'bottom-left', children: <Transfer id={id} /> }}
      >
        <span>Gift</span>
      </PopupWrapper>

      <PopupWrapper popup={{ title: 'Trade', position: 'bottom-left', children: <span>In development...</span> }}>
        <span>Trade</span>
      </PopupWrapper>

      <PopupWrapper popup={{ title: 'Share', position: 'bottom-left', children: <Share id={id} /> }}>
        <span>Share</span>
      </PopupWrapper>

      <span divider='true'></span>

      <PopupWrapper
        ref={confirmationPopupRef}
        popup={{
          title: !deleting ? 'Are you sure?' : 'Deleting...',
          position: 'bottom-left',
          children: !deleting ? <Confirmation onConfirm={onConfirm} onReject={onReject} /> : <BasicSpinner />,
        }}
      >
        <span>Delete</span>
      </PopupWrapper>
    </Dropdown>
  );
};

ActionsDropdown.propTypes = ActionsDropdownPropTypes;

export default ActionsDropdown;
