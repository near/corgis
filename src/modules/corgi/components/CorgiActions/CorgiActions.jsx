import React, { useContext, useEffect, useRef } from 'react';

import './CorgiActions.scss';

import { ContractContext } from '~contexts';

import { DeletePopup, GiftPopup, SharePopup, TradePopup } from '~modules/common/corgi';

import { CorgiType } from '~types/CorgiTypes';

const CorgiActionsPropTypes = {
  id: CorgiType.id.isRequired,
};

const CorgiActions = ({ id, showOnlyShare = false }) => {
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
    </div>
  );
};

CorgiActions.propTypes = CorgiActionsPropTypes;

export default CorgiActions;
