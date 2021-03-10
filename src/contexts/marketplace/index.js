import React, { useReducer, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as nearAPI from 'near-api-js';

import { marketplaceReducer, initialMarketplaceState } from './reducer';
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

import { AUCTION_DURATION, BOATLOAD_OF_GAS } from '~constants/corgi';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';
import { parseNears } from '~helpers/nears';

export const MarketplaceContext = React.createContext(initialMarketplaceState);

const MarketplaceContextProviderPropTypes = {
  Contract: PropTypes.shape({
    get_items_for_sale: PropTypes.func.isRequired,
    add_item_for_sale: PropTypes.func.isRequired,
    bid_for_item: PropTypes.func.isRequired,
    clearance_for_item: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};

export const MarketplaceContextProvider = ({ Contract, children }) => {
  const [marketplaceState, dispatchMarketplace] = useReducer(marketplaceReducer, initialMarketplaceState);

  const getCorgisForSale = useCallback(() => {
    dispatchMarketplace({ type: GET_CORGIS_FOR_SALE_START });
    Contract.get_items_for_sale()
      .then((corgis) => dispatchMarketplace({ type: GET_CORGIS_FOR_SALE_SUCCESS, payload: { corgis } }))
      .catch((error) => dispatchMarketplace({ type: ACTION_ERROR, payload: { error } }));
  }, [Contract]);

  const addCorgiForSale = useCallback(
    (id) => {
      dispatchMarketplace({ type: ADD_CORGI_FOR_SALE_START });
      Contract.add_item_for_sale({ token_id: id, duration: AUCTION_DURATION }, BOATLOAD_OF_GAS)
        .then(() => dispatchMarketplace({ type: ADD_CORGI_FOR_SALE_SUCCESS }))
        .catch((error) => dispatchMarketplace({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const bidForCorgi = useCallback(
    (id, amount) => {
      dispatchMarketplace({ type: BID_FOR_CORGI_START });
      Contract.bid_for_item({ token_id: id }, BOATLOAD_OF_GAS, parseNears(`${amount}`))
        .then(() => dispatchMarketplace({ type: BID_FOR_CORGI_SUCCESS }))
        .catch((error) => dispatchMarketplace({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const clearanceForCorgi = useCallback(
    (id) => {
      dispatchMarketplace({ type: CLEARANCE_FOR_CORGI_START });
      Contract.clearance_for_item({ token_id: id }, BOATLOAD_OF_GAS)
        .then(() => dispatchMarketplace({ type: CLEARANCE_FOR_CORGI_SUCCESS }))
        .catch((error) => dispatchMarketplace({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const clearState = () => dispatchMarketplace({ type: CLEAR_STATE });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      clearState();
      clearTimeout(timeoutId);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [marketplaceState.added, marketplaceState.bidded, marketplaceState.cleared]);

  const value = {
    corgisForSale: marketplaceState.corgisForSale,
    loading: marketplaceState.loading,
    error: marketplaceState.error,
    adding: marketplaceState.adding,
    added: marketplaceState.added,
    bidding: marketplaceState.bidding,
    bidded: marketplaceState.bidded,
    clearing: marketplaceState.clearing,
    cleared: marketplaceState.cleared,
    getCorgisForSale,
    addCorgiForSale,
    bidForCorgi,
    clearanceForCorgi,
  };

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

MarketplaceContextProvider.propTypes = MarketplaceContextProviderPropTypes;
