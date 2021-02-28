import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { ContractContext, NearContext } from '~contexts';

import { DeletePopup, GiftPopup, SharePopup, TradePopup } from '~modules/common/corgi';

import { CorgiType, CorgiTypeShape } from '~types/CorgiTypes';
import { Dropdown } from '~modules/common';

const CorgiActionsPropTypes = {
  id: CorgiType.id.isRequired,
  owner: CorgiType.owner.isRequired,
  isDropdown: PropTypes.bool,
};

const CorgiActions = ({ id, owner, isDropdown = false }) => {
  const { user } = useContext(NearContext);
  const { deleteCorgi, deleting, deleted, transfered } = useContext(ContractContext);

  const [showOnlyShare, setShowOnlyShare] = useState(false);

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
      // if (confirmationPopupRef && confirmationPopupRef.current) {
      //   confirmationPopupRef.current.hidePopup();
      // }
    }
  }, [deleted, transfered, dropdownRef]);

  useEffect(() => {
    if (!user || user.accountId !== owner) {
      setShowOnlyShare(true);
    }
  }, [user, owner]);

  return (
    <>
      {isDropdown ? (
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
      ) : (
        <>
          {!showOnlyShare && <GiftPopup id={id} asButton />}

          {!showOnlyShare && <TradePopup asButton />}

          <SharePopup id={id} asButton />

          {!showOnlyShare && (
            <DeletePopup
              ref={confirmationPopupRef}
              onConfirm={onConfirm}
              onReject={onReject}
              deleting={deleting}
              asButton
            />
          )}
        </>
      )}
    </>
  );
};

CorgiActions.propTypes = CorgiActionsPropTypes;

export default CorgiActions;
