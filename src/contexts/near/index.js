import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

import { initialNearState, nearReducer } from './reducer';
import { CLEAR_STATE, SET_USER } from './types';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

export const NearContext = React.createContext({
  ...initialNearState,
  nearContract: null,
  signIn: () => {},
  signOut: () => {},
  startLoading: () => {},
});

const NearContextProviderPropTypes = {
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
  nearConfig: PropTypes.shape({ contractName: PropTypes.string.isRequired }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
  }).isRequired,
  near: PropTypes.shape({ connection: PropTypes.object.isRequired }).isRequired,
  children: ReactChildrenTypeRequired,
};

export const NearContextProvider = ({ currentUser, nearConfig, wallet, near, children }) => {
  const [nearState, dispatchNear] = useReducer(nearReducer, initialNearState);

  const setUser = (user) => {
    dispatchNear({ type: SET_USER, payload: { user } });
  };

  const clearState = () => {
    dispatchNear({ type: CLEAR_STATE });
  };

  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, 'NEAR Corgi');
  };

  const signOut = () => {
    wallet.signOut();

    clearState();
  };

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  return (
    <NearContext.Provider
      value={{
        user: nearState.user,
        nearContent: near,
        signIn,
        signOut,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};

NearContextProvider.propTypes = NearContextProviderPropTypes;