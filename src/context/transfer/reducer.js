import { FOUND_RECEIVER_SUCCESS, FOUND_RECEIVER_ERROR, SET_RECEIVER, SET_MESSAGE } from './types';

export const initialTransferState = {
  found: false,
  receiver: undefined,
  message: undefined,
  error: null,
};

export const transferReducer = (state = initialTransferState, action) => {
  switch (action.type) {
    case FOUND_RECEIVER_SUCCESS:
      return {
        ...state,
        found: true,
        error: null,
      };

    case FOUND_RECEIVER_ERROR:
      return {
        ...state,
        found: false,
        error: action.payload.error,
      };

    case SET_RECEIVER:
      return {
        ...state,
        receiver: action.payload.receiver,
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload.message,
      };

    default:
      return initialTransferState;
  }
};
