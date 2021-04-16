import {
  ACTION_ERROR,
  GET_CORGIS_FOR_SALE_START,
  GET_CORGIS_FOR_SALE_SUCCESS,
  ADD_CORGI_FOR_SALE_START,
  ADD_CORGI_FOR_SALE_SUCCESS,
  BID_FOR_CORGI_START,
  BID_FOR_CORGI_SUCCESS,
  CLEARANCE_FOR_CORGI_START,
  CLEARANCE_FOR_CORGI_SUCCESS,
  CLEAR_STATE,
} from './types';

export const initialMarketplaceState = {
  corgisForSale: [],
  loading: false,
  error: null,
  adding: false,
  added: false,
  bidding: false,
  bidded: false,
  clearing: false,
  cleared: false,
};

export const marketplaceReducer = (currentState = initialMarketplaceState, action) => {
  switch (action.type) {
    case ACTION_ERROR:
      return {
        ...currentState,
        loading: false,
        error: action.payload.error,
      };

    case GET_CORGIS_FOR_SALE_START:
      return {
        ...currentState,
        loading: true,
      };

    case GET_CORGIS_FOR_SALE_SUCCESS:
      return {
        ...currentState,
        loading: false,
        corgisForSale: action.payload.corgis,
        error: null,
      };

    case ADD_CORGI_FOR_SALE_START:
      return {
        ...currentState,
        adding: true,
        added: false,
      };

    case ADD_CORGI_FOR_SALE_SUCCESS:
      return {
        ...currentState,
        adding: false,
        added: true,
        error: null,
      };

    case BID_FOR_CORGI_START:
      return {
        ...currentState,
        bidding: true,
        bidded: false,
      };

    case BID_FOR_CORGI_SUCCESS:
      return {
        ...currentState,
        bidding: false,
        bidded: true,
        error: null,
      };

    case CLEARANCE_FOR_CORGI_START:
      return {
        ...currentState,
        clearing: true,
        cleared: false,
      };

    case CLEARANCE_FOR_CORGI_SUCCESS:
      return {
        ...currentState,
        clearing: false,
        cleared: true,
        error: null,
      };

    case CLEAR_STATE:
      return {
        ...currentState,
        loading: false,
        error: null,
        adding: false,
        added: false,
        bidding: false,
        bidded: false,
        clearing: false,
        cleared: false,
      };

    default:
      return initialMarketplaceState;
  }
};
