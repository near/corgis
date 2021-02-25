import 'regenerator-runtime/runtime';

import React, { useContext, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import './App.scss';

import { ContractContext, NearContext } from '~contexts';

import { Header } from '~modules/header';
import { Footer } from '~modules/footer';

import Routes from '~router/Routes';

const App = () => {
  const { user } = useContext(NearContext);
  const { created, deleting, transfering, getCorgis } = useContext(ContractContext);

  useEffect(() => {
    if (user && !deleting && !transfering) {
      getCorgis(user.accountId);
    }
  }, [user, created, deleting, transfering]);

  return (
    <div className='App'>
      <div className='page'>
        <Router hashType='noslash'>
          <Header />
          <Routes />
        </Router>
      </div>

      <Footer />
    </div>
  );
};

export default App;
