import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';

import Big from 'big.js';
import {
  CLEAR,
  CLEAR_CREATED_CORGI_STATE,
  CREATE_CORGI_SUCCESS,
  CREATE_START,
  DELETE_CORGI_SUCCESS,
  DELETE_START,
  FAIL,
  GET_CORGISLIST_SUCCESS,
  GET_CORGI_SUCCESS,
  GET_DISPLAY_CORGIS,
  START,
  TRANSFER_CORGI_SUCCESS,
  TRANSFER_START,
} from './types';
import { contractReducer, initialContractState } from './reducer';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

const BOATLOAD_OF_GAS = Big(1)
  .times(10 ** 14)
  .toFixed();

export const ContractContext = React.createContext();

const ContractContextProviderPropTypes = {
  Contract: PropTypes.shape({
    getCorgi: PropTypes.func.isRequired,
    getCorgisList: PropTypes.func.isRequired,
    displayGlobalCorgis: PropTypes.func.isRequired,
    transferCorgi: PropTypes.func.isRequired,
    createCorgi: PropTypes.func.isRequired,
    deleteCorgi: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};

export const ContractContextProvider = ({ Contract, children }) => {
  const [contractState, dispatchContract] = useReducer(contractReducer, initialContractState);

  const clear = () => dispatchContract({ type: CLEAR });

  const clearCreatedCorgiState = () => dispatchContract({ type: CLEAR_CREATED_CORGI_STATE });

  const createCorgi = useCallback(
    (name, color, backgroundColor, quote) => {
      dispatchContract({ type: CREATE_START });
      Contract.createCorgi({ name, color, backgroundColor, quote }, BOATLOAD_OF_GAS)
        .then(() => {
          dispatchContract({ type: CREATE_CORGI_SUCCESS });
        })
        .catch((error) => dispatchContract({ type: FAIL, error }));
    },
    [Contract],
  );

  const transferCorgi = useCallback(
    (receiver, id, message) => {
      dispatchContract({ type: TRANSFER_START });
      Contract.transferCorgi({ receiver, id, message }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: TRANSFER_CORGI_SUCCESS }))
        .catch((error) => dispatchContract({ type: FAIL, error }));
    },
    [Contract],
  );

  const deleteCorgi = useCallback(
    (id) => {
      dispatchContract({ type: DELETE_START });
      Contract.deleteCorgi({ id }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: DELETE_CORGI_SUCCESS }))
        .catch((error) => dispatchContract({ type: FAIL, error }));
    },
    [Contract],
  );

  const getCorgisList = useCallback(
    (owner) => {
      dispatchContract({ type: START });
      Contract.getCorgisList({ owner })
        .then((corgis) => dispatchContract({ type: GET_CORGISLIST_SUCCESS, corgis }))
        .catch((error) => dispatchContract({ type: FAIL, error }));
    },
    [Contract],
  );

  const getCorgi = useCallback(
    (id) => {
      dispatchContract({ type: START });
      Contract.getCorgi({ id })
        .then((corgi) => dispatchContract({ type: GET_CORGI_SUCCESS, corgi }))
        .catch((error) => dispatchContract({ type: FAIL, error }));
    },
    [Contract],
  );

  const getDisplayCorgis = useCallback(() => {
    dispatchContract({ type: START });
    Contract.displayGlobalCorgis()
      .then((corgis) => dispatchContract({ type: GET_DISPLAY_CORGIS, corgis }))
      .catch((error) => dispatchContract({ type: FAIL, error }));
  }, [Contract]);

  const value = {
    loading: contractState.loading,
    error: contractState.error,
    corgis: contractState.corgis,
    displayCorgis: contractState.displayCorgis,
    creating: contractState.creating,
    created: contractState.created,
    transfering: contractState.transfering,
    deleting: contractState.deleting,
    corgi: contractState.corgi,
    info: contractState.info,
    clear,
    clearCreatedCorgiState,
    getCorgi,
    getCorgisList,
    createCorgi,
    deleteCorgi,
    transferCorgi,
    getDisplayCorgis,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};

ContractContextProvider.propTypes = ContractContextProviderPropTypes;
