import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';

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

import { contractReducer, initialContractState } from './reducer';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

import BOATLOAD_OF_GAS from '~constants/corgi';

export const ContractContext = React.createContext();

const ContractContextProviderPropTypes = {
  Contract: PropTypes.shape({
    get_corgi_by_id: PropTypes.func.isRequired,
    get_corgis_by_owner: PropTypes.func.isRequired,
    get_global_corgis: PropTypes.func.isRequired,
    transfer_corgi: PropTypes.func.isRequired,
    create_corgi: PropTypes.func.isRequired,
    delete_corgi: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};

export const ContractContextProvider = ({ Contract, children }) => {
  const [contractState, dispatchContract] = useReducer(contractReducer, initialContractState);

  const getCorgi = useCallback(
    (id) => {
      dispatchContract({ type: ACTION_START });
      Contract.get_corgi_by_id({ id })
        .then((corgi) => dispatchContract({ type: GET_CORGI_SUCCESS, payload: { corgi } }))
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const getCorgis = useCallback(
    (owner) => {
      dispatchContract({ type: ACTION_START });
      Contract.get_corgis_by_owner({ owner })
        .then((corgis) => dispatchContract({ type: GET_CORGIS_SUCCESS, payload: { corgis } }))
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const getGlobalCorgis = useCallback(() => {
    dispatchContract({ type: ACTION_START });
    Contract.get_global_corgis()
      .then((corgis) => dispatchContract({ type: GET_GLOBAL_CORGIS_SUCCESS, payload: { corgis } }))
      .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
  }, [Contract]);

  const createCorgi = useCallback(
    (name, color, background_color, quote) => {
      dispatchContract({ type: CREATE_CORGI_START });
      Contract.create_corgi({ name, color, background_color, quote }, BOATLOAD_OF_GAS)
        .then(() => {
          dispatchContract({ type: CREATE_CORGI_SUCCESS });
        })
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const deleteCorgi = useCallback(
    (id) => {
      dispatchContract({ type: DELETE_CORGI_START });
      Contract.delete_corgi({ id }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: DELETE_CORGI_SUCCESS }))
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const transferCorgi = useCallback(
    (receiver, id, message) => {
      dispatchContract({ type: TRANSFER_CORGI_START });
      Contract.transfer_corgi({ receiver, id, message }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: TRANSFER_CORGI_SUCCESS }))
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const clearState = () => dispatchContract({ type: CLEAR_STATE });

  const clearCreatedCorgi = () => dispatchContract({ type: CLEAR_CREATED_CORGI });

  const value = {
    loading: contractState.loading,
    error: contractState.error,
    corgis: contractState.corgis,
    globalCorgis: contractState.globalCorgis,
    creating: contractState.creating,
    created: contractState.created,
    transfering: contractState.transfering,
    deleting: contractState.deleting,
    corgi: contractState.corgi,
    info: contractState.info,
    clearState,
    clearCreatedCorgi,
    getCorgi,
    getCorgis,
    createCorgi,
    deleteCorgi,
    transferCorgi,
    getGlobalCorgis,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};

ContractContextProvider.propTypes = ContractContextProviderPropTypes;
