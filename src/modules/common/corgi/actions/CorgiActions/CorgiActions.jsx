import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { ContractContext, NearContext } from '~contexts';

import { Dropdown } from '~modules/common';
import { DeletePopup, GiftPopup, SharePopup, TradePopup } from '~modules/common/corgi';

import { CorgiType } from '~types/CorgiTypes';

const CorgiActionsPropTypes = {
  id: CorgiType.id.isRequired,
  owner: CorgiType.owner.isRequired,
  isDropdown: PropTypes.bool,
};

const CorgiActions = ({ id, owner, isDropdown = false }) => {
  const { user } = useContext(NearContext);
  const { deleted, transfered } = useContext(ContractContext);

  const [showOnlyShare, setShowOnlyShare] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    if (!user || user.accountId !== owner) {
      setShowOnlyShare(true);
    }
  }, [user, owner]);

  useEffect(() => {
    if ((deleted || transfered) && dropdownRef && dropdownRef.current) {
      dropdownRef.current.closeDropdown();
    }
  }, [deleted, transfered, dropdownRef]);

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

          {!showOnlyShare && <DeletePopup id={id} />}
        </Dropdown>
      ) : (
        <>
          {!showOnlyShare && <GiftPopup id={id} asButton />}

          {!showOnlyShare && <TradePopup asButton />}

          <SharePopup id={id} asButton />

          {!showOnlyShare && <DeletePopup id={id} asButton />}
        </>
      )}
    </>
  );
};

CorgiActions.propTypes = CorgiActionsPropTypes;

export default CorgiActions;
