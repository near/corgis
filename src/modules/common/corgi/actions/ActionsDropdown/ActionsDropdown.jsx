import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './ActionsDropdown.scss';

import { ContractContext } from '~contexts/';

import { Dropdown } from '~modules/common';
import { DeletePopup, GiftPopup, SharePopup, TradePopup } from '~modules/common/corgi';

import { CorgiType } from '~types/CorgiTypes';

const ActionsDropdownPropTypes = { id: CorgiType.id.isRequired, showOnlyShare: PropTypes.bool };

const ActionsDropdown = ({ id, showOnlyShare = false }) => {
  const { deleteCorgi, deleting, deleted, transfered } = useContext(ContractContext);

  const dropdownRef = useRef();
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

  useEffect(() => {
    if (deleted || transfered) {
      if (dropdownRef && dropdownRef.current) {
        dropdownRef.current.closeDropdown();
      }
      if (confirmationPopupRef && confirmationPopupRef.current) {
        confirmationPopupRef.current.hidePopup();
      }
    }
  }, [deleted, transfered, confirmationPopupRef]);

  return (
    <Dropdown
      ref={dropdownRef}
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
      {!showOnlyShare && <GiftPopup id={id} />}

      {!showOnlyShare && <TradePopup />}

      <SharePopup id={id} />

      {!showOnlyShare && <span divider='true'></span>}

      {!showOnlyShare && (
        <DeletePopup ref={confirmationPopupRef} onConfirm={onConfirm} onReject={onReject} deleting={deleting} />
      )}
    </Dropdown>
  );
};

ActionsDropdown.propTypes = ActionsDropdownPropTypes;

export default ActionsDropdown;
