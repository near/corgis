import React, { useReducer } from 'react';

import { transferReducer, initialTransferState } from './reducer';
import { FOUND_RECEIVER_SUCCESS, FOUND_RECEIVER_ERROR, SET_RECEIVER, SET_MESSAGE } from './types';

export const TransferContext = React.createContext(initialTransferState);

export const TransferContextProvider = ({ children }) => {
  const [transferState, dispatchTransfer] = useReducer(transferReducer, initialTransferState);

  const foundReceiverSuccess = () => dispatchTransfer({ type: FOUND_RECEIVER_SUCCESS });

  const foundReceiverError = (error) => dispatchTransfer({ type: FOUND_RECEIVER_ERROR, payload: { error } });

  const setReceiver = (receiver) => dispatchTransfer({ type: SET_RECEIVER, payload: { receiver } });

  const setMessage = (message) => dispatchTransfer({ type: SET_MESSAGE, payload: { message } });

  const value = {
    found: transferState.found,
    receiver: transferState.receiver,
    message: transferState.message,
    error: transferState.error,
    foundReceiverSuccess,
    foundReceiverError,
    setReceiver,
    setMessage,
  };

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
};
