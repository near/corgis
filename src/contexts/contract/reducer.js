import {
  ACTION_START,
  ACTION_ERROR,
  GET_CORGI_SUCCESS,
  GET_CORGIS_SUCCESS,
  GET_GLOBAL_CORGIS_SUCCESS,
  CREATE_CORGI_START,
  CREATE_CORGI_SUCCESS,
  DELETE_CORGI_START,
  DELETE_CORGI_SUCCESS,
  TRANSFER_CORGI_START,
  TRANSFER_CORGI_SUCCESS,
  CLEAR_CREATED_CORGI,
  CLEAR_STATE,
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
  globalCorgis: [],
};

export const contractReducer = (currentState = initialContractState, action) => {
  switch (action.type) {
    case ACTION_START:
      return {
        ...currentState,
        loading: true,
      };

    case ACTION_ERROR:
      return {
        ...currentState,
        loading: false,
        creating: false,
        transfering: false,
        deleting: false,
        error: action.payload.error,
      };

    case GET_CORGI_SUCCESS:
      return {
        ...currentState,
        loading: false,
        corgi: action.payload.corgi,
        error: null,
      };

    case GET_CORGIS_SUCCESS:
      return {
        ...currentState,
        loading: false,
        corgis: action.payload.corgis,
        error: null,
      };

    case GET_GLOBAL_CORGIS_SUCCESS:
      return {
        ...currentState,
        loading: false,
        globalCorgis: action.payload.corgis,
        error: null,
      };

    case CREATE_CORGI_START:
      return {
        ...currentState,
        creating: true,
      };

    case CREATE_CORGI_SUCCESS:
      return {
        ...currentState,
        creating: false,
        created: true,
        error: null,
      };

    case TRANSFER_CORGI_START:
      return {
        ...currentState,
        transfering: true,
      };

    case TRANSFER_CORGI_SUCCESS:
      return {
        ...currentState,
        transfering: false,
        error: null,
      };

    case DELETE_CORGI_START:
      return {
        ...currentState,
        deleting: true,
      };

    case DELETE_CORGI_SUCCESS:
      return {
        ...currentState,
        deleting: false,
        error: null,
      };

    case CLEAR_STATE:
      return {
        ...currentState,
        error: null,
      };

    case CLEAR_CREATED_CORGI:
      return {
        ...currentState,
        creating: false,
        created: false,
      };

    default:
      return initialContractState;
  }
};
