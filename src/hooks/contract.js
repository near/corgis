import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

const BOATLOAD_OF_GAS = Big(1)
  .times(10 ** 14)
  .toFixed();

const initialState = {
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

const contractReducer = (currentState, action) => {
  switch (action.type) {
    case 'START':
      return {
        ...currentState,
        loading: true,
      };
    case 'FAIL':
      return {
        ...currentState,
        loading: false,
        creating: false,
        transfering: false,
        deleting: false,
        error: action.error,
      };
    case 'GET_DISPLAY_CORGIS':
      return {
        ...currentState,
        loading: false,
        displayCorgis: action.corgis,
      };
    case 'GET_CORGISLIST_SUCCESS':
      return {
        ...currentState,
        loading: false,
        corgis: action.corgis,
      };
    case 'GET_CORGI_SUCCESS':
      return {
        ...currentState,
        loading: false,
        corgi: action.corgi,
      };
    case 'CREATE_START':
      return {
        ...currentState,
        creating: true,
      };
    case 'CREATE_CORGI_SUCCESS':
      return {
        ...currentState,
        creating: false,
        created: true,
      };
    case 'TRANSFER_START':
      return {
        ...currentState,
        transfering: true,
      };
    case 'TRANSFER_CORGI_SUCCESS':
      return {
        ...currentState,
        transfering: false,
      };
    case 'DELETE_START':
      return {
        ...currentState,
        deleting: true,
      };
    case 'DELETE_CORGI_SUCCESS':
      return {
        ...currentState,
        deleting: false,
      };
    case 'CLEAR':
      return {
        ...currentState,
        error: null,
      };
    default:
      return initialState;
  }
};

export const ContractContext = React.createContext();

export const ContractContextProvider = ({ Contract, children }) => {
  const [contractState, dispatchContract] = useReducer(
    contractReducer,
    initialState
  );

  const clear = useCallback(() => dispatchContract({ type: 'CLEAR' }), []);

  const createCorgi = useCallback(
    (name, color, backgroundColor, quote) => {
      dispatchContract({ type: 'CREATE_START' });
      Contract.createCorgi(
        { name, color, backgroundColor, quote },
        BOATLOAD_OF_GAS
      )
        .then(() => {
          dispatchContract({ type: 'CREATE_CORGI_SUCCESS' });
        })
        .catch((error) => dispatchContract({ type: 'FAIL', error }));
    },
    [Contract]
  );

  const transferCorgi = useCallback(
    (receiver, id, message) => {
      dispatchContract({ type: 'TRANSFER_START' });
      Contract.transferCorgi({ receiver, id, message }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: 'TRANSFER_CORGI_SUCCESS' }))
        .catch((error) => dispatchContract({ type: 'FAIL', error }));
    },
    [Contract]
  );

  const deleteCorgi = useCallback(
    (id) => {
      dispatchContract({ type: 'DELETE_START' });
      Contract.deleteCorgi({ id }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: 'DELETE_CORGI_SUCCESS' }))
        .catch((error) => dispatchContract({ type: 'FAIL', error }));
    },
    [Contract]
  );

  const getCorgisList = useCallback(
    (owner) => {
      dispatchContract({ type: 'START' });
      Contract.getCorgisList({ owner })
        .then((corgis) =>
          dispatchContract({ type: 'GET_CORGISLIST_SUCCESS', corgis })
        )
        .catch((error) => dispatchContract({ type: 'FAIL', error }));
    },
    [Contract]
  );

  const getCorgi = useCallback(
    (id) => {
      dispatchContract({ type: 'START' });
      Contract.getCorgi({ id })
        .then((corgi) => dispatchContract({ type: 'GET_CORGI_SUCCESS', corgi }))
        .catch((error) => dispatchContract({ type: 'FAIL', error }));
    },
    [Contract]
  );

  const getDisplayCorgis = useCallback(() => {
    dispatchContract({ type: 'START' });
    Contract.displayGlobalCorgis()
      .then((corgis) =>
        dispatchContract({ type: 'GET_DISPLAY_CORGIS', corgis })
      )
      .catch((error) => dispatchContract({ type: 'FAIL', error }));
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
    getCorgi,
    getCorgisList,
    createCorgi,
    deleteCorgi,
    transferCorgi,
    getDisplayCorgis,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

ContractContextProvider.propTypes = {
  Contract: PropTypes.shape({
    getCorgi: PropTypes.func.isRequired,
    getCorgisList: PropTypes.func.isRequired,
    displayGlobalCorgis: PropTypes.func.isRequired,
    transferCorgi: PropTypes.func.isRequired,
    createCorgi: PropTypes.func.isRequired,
    deleteCorgi: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
};

export default ContractContextProvider;
