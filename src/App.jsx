import 'regenerator-runtime/runtime';

import React, { useContext, useEffect } from 'react';

import './App.scss';

import { ContractContext, NearContext } from '~contexts';

import Routes from '~router/Routes';

const App = () => {
  const { user } = useContext(NearContext);
  const { created, deleted, transfered, getCorgisByCurrentUser, clearState } = useContext(ContractContext);

  useEffect(() => {
    if (created || deleted || transfered) {
      clearState();
    }
  }, [created, deleted, transfered]);

  useEffect(() => {
    if (user && !created && !deleted && !transfered) {
      getCorgisByCurrentUser();
    }
  }, [user, created, deleted, transfered]);

  return (
    <div className='App'>
      <div className='page'>
        <Routes />
      </div>
    </div>
  );
};

export default App;
