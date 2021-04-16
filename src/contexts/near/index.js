/* global localStorage:true */
import React, { useReducer, useEffect } from 'react';

import { initialNearState, nearReducer } from './reducer';
import { CLEAR_STATE, LOADING_ERROR, LOADING_START, LOADING_SUCCESS, SET_USER } from './types';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenTypes';
import { NearConfigTypeShape, NearTypeShape, UserTypeShape, WalletTypeShape } from '~types/NearTypes';

export const NearContext = React.createContext({
  ...initialNearState,
  nearContract: null,
  signIn: () => {},
  signOut: () => {},
  startLoading: () => {},
});

const NearContextProviderPropTypes = {
  nearConfig: NearConfigTypeShape.isRequired,
  near: NearTypeShape.isRequired,
  wallet: WalletTypeShape.isRequired,
  currentUser: UserTypeShape,
  children: ReactChildrenTypeRequired,
};

export const NearContextProvider = ({ currentUser, nearConfig, wallet, near, children }) => {
  const [nearState, dispatchNear] = useReducer(nearReducer, initialNearState);

  const setUser = (user) => {
    dispatchNear({ type: SET_USER, payload: { user } });
  };

  const loadingStart = () => {
    dispatchNear({ type: LOADING_START });
  };

  const loadingSuccess = () => {
    dispatchNear({ type: LOADING_SUCCESS });
  };

  const loadingError = (error) => {
    dispatchNear({ type: LOADING_ERROR, payload: { error } });
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
    if (currentUser && Object.keys(currentUser).length) {
      setUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!nearState.user && !nearState.isLoading && !nearState.error) {
      loadingStart();
    }
  }, [nearState]);

  useEffect(() => {
    if (nearState.user && nearState.isLoading) {
      loadingSuccess();
    }
  }, [nearState]);

  useEffect(() => {
    if (!nearState.user && !localStorage.getItem('undefined_wallet_auth_key') && !nearState.error) {
      localStorage.clear();
      loadingError('wallet not found');
    }
  }, [nearState]);

  return (
    <NearContext.Provider
      value={{
        user: nearState.user,
        isLoading: nearState.isLoading,
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
