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

const NearContextProvider = ({
  currentUser,
  nearConfig,
  wallet,
  near,
  children,
}) => {
  const user = useState(currentUser)[0];
  const nearContent = useState(near)[0];
  const [isLoading, setLoading] = useState(false);

  const signIn = useCallback(() => {
    wallet.requestSignIn(nearConfig.contractName, 'NEAR Corgi');
  }, [wallet, nearConfig]);

  const signOut = useCallback(() => {
    wallet.signOut();
    setTimeout(setLoading(true), 2000);
    window.location = '/';
    setLoading(false);
  }, [wallet]);

  return (
    <NearContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoading,
        setLoading,
        nearContent,
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

export default NearContextProvider;
