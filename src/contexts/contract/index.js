import React, { useReducer, useCallback, useEffect, useContext } from 'react';
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
  CLEAR_STATE,
} from './types';

import { contractReducer, initialContractState } from './reducer';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

import BOATLOAD_OF_GAS from '~constants/corgi';
import { NearContext } from '~contexts/';

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

  const { user } = useContext(NearContext);

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
      return Contract.get_corgis_by_owner({ owner }).then((corgis) => corgis);
    },
    [Contract],
  );

  const getCorgisByCurrentUser = useCallback(() => {
    if (user) {
      dispatchContract({ type: ACTION_START });
      Contract.get_corgis_by_owner({ owner: user.accountId })
        .then((corgis) => dispatchContract({ type: GET_CORGIS_SUCCESS, payload: { corgis } }))
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    }
  }, [user, Contract]);

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
      Contract.delete_corgi({ id })
        .then(() => dispatchContract({ type: DELETE_CORGI_SUCCESS }))
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const transferCorgi = useCallback(
    (receiver, id) => {
      dispatchContract({ type: TRANSFER_CORGI_START });
      Contract.transfer_corgi({ receiver, id }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: TRANSFER_CORGI_SUCCESS }))
        .catch((error) => dispatchContract({ type: ACTION_ERROR, payload: { error } }));
    },
    [Contract],
  );

  const clearState = () => dispatchContract({ type: CLEAR_STATE });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      clearState();
      clearTimeout(timeoutId);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [contractState.deleted, contractState.created, contractState.trasfered]);

  const value = {
    loading: contractState.loading,
    error: contractState.error,
    corgis: contractState.corgis,
    globalCorgis: contractState.globalCorgis,
    creating: contractState.creating,
    created: contractState.created,
    transfering: contractState.transfering,
    transfered: contractState.transfered,
    deleting: contractState.deleting,
    deleted: contractState.deleted,
    corgi: contractState.corgi,
    info: contractState.info,
    clearState,
    getCorgi,
    getCorgis,
    getCorgisByCurrentUser,
    createCorgi,
    deleteCorgi,
    transferCorgi,
    getGlobalCorgis,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};

ContractContextProvider.propTypes = ContractContextProviderPropTypes;
