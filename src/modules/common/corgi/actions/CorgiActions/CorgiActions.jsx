import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { ContractContext, CorgiActionsContextProvider, NearContext } from '~contexts';

import { Dropdown } from '~modules/common';
import { DeletePopup, GiftPopup, SharePopup, TradePopup } from '~modules/common/corgi';

import { CorgiTypeShape } from '~types/CorgiTypes';

const CorgiActionsPropTypes = { corgi: CorgiTypeShape.isRequired, isDropdown: PropTypes.bool };

const CorgiActions = ({ corgi, isDropdown = false }) => {
  const { user } = useContext(NearContext);
  const { deleted, transfered } = useContext(ContractContext);

  const { owner, for_sale } = corgi;

  const showOnlyShare = !user || user.accountId !== owner || for_sale;

  const dropdownRef = useRef();

  useEffect(() => {
    if ((deleted || transfered) && dropdownRef && dropdownRef.current) {
      dropdownRef.current.closeDropdown();
    }
  }, [deleted, transfered, dropdownRef]);

  return (
    <CorgiActionsContextProvider corgi={corgi}>
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
          {!showOnlyShare && <GiftPopup />}

          {!showOnlyShare && <TradePopup />}

          <SharePopup />

          {!showOnlyShare && <span divider='true'></span>}

          {!showOnlyShare && <DeletePopup />}
        </Dropdown>
      ) : (
        <>
          {!showOnlyShare && <GiftPopup asButton />}

          {!showOnlyShare && <TradePopup asButton />}

          <SharePopup asButton />

          {!showOnlyShare && <DeletePopup asButton />}
        </>
      )}
    </CorgiActionsContextProvider>
  );
};

CorgiActions.propTypes = CorgiActionsPropTypes;

export default CorgiActions;
