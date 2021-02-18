import {
  START,
  FAIL,
  GET_DISPLAY_CORGIS,
  GET_CORGISLIST_SUCCESS,
  GET_CORGI_SUCCESS,
  CREATE_START,
  CREATE_CORGI_SUCCESS,
  TRANSFER_START,
  TRANSFER_CORGI_SUCCESS,
  DELETE_START,
  DELETE_CORGI_SUCCESS,
  CLEAR,
  CLEAR_CREATED_CORGI_STATE,
} from './types';

export const initialContractState = {
  loading: false,
  error: null,
  corgis: null,
  creating: false,
  created: false,
  transfering: false,
  deleting: false,
  corgi: null,
  displayCorgis: [],
};

export const contractReducer = (currentState = initialContractState, action) => {
  switch (action.type) {
    case START:
      return {
        ...currentState,
        loading: true,
      };
    case FAIL:
      return {
        ...currentState,
        loading: false,
        creating: false,
        transfering: false,
        deleting: false,
        error: action.error,
      };
    case GET_DISPLAY_CORGIS:
      return {
        ...currentState,
        loading: false,
        displayCorgis: action.corgis,
      };
    case GET_CORGISLIST_SUCCESS:
      return {
        ...currentState,
        loading: false,
        corgis: action.corgis,
      };
    case GET_CORGI_SUCCESS:
      return {
        ...currentState,
        loading: false,
        corgi: action.corgi,
      };
    case CREATE_START:
      return {
        ...currentState,
        creating: true,
      };
    case CREATE_CORGI_SUCCESS:
      return {
        ...currentState,
        creating: false,
        created: true,
      };
    case TRANSFER_START:
      return {
        ...currentState,
        transfering: true,
      };
    case TRANSFER_CORGI_SUCCESS:
      return {
        ...currentState,
        transfering: false,
      };
    case DELETE_START:
      return {
        ...currentState,
        deleting: true,
      };
    case DELETE_CORGI_SUCCESS:
      return {
        ...currentState,
        deleting: false,
      };
    case CLEAR:
      return {
        ...currentState,
        error: null,
      };
    case CLEAR_CREATED_CORGI_STATE:
      return {
        ...currentState,
        creating: false,
        created: false,
      };
    default:
      return initialContractState;
  }
};
