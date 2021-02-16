import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

export const NearContext = React.createContext({
  user: null,
  nearContract: null,
  signIn: () => {},
  signOut: () => {},
  isLoading: false,
  setLoading: () => {},
});

export const NearContextProvider = ({ currentUser, nearConfig, wallet, near, children }) => {
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState(currentUser || null);

  const signIn = useCallback(() => {
    wallet.requestSignIn(nearConfig.contractName, 'NEAR Corgi');
  }, [wallet, nearConfig]);

  const signOut = useCallback(() => {
    wallet.signOut();
    setTimeout(setLoading(true), 2000);
    setLoading(false);
    setUser(null);
  }, [wallet]);

  return (
    <NearContext.Provider
      value={{
        user,
        nearContent: near,
        isLoading,
        setLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};

NearContextProvider.propTypes = {
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
  children: PropTypes.element.isRequired,
};
