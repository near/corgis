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
  const { created, deleting, getCorgis } = useContext(ContractContext);

  useEffect(() => {
    if (user && !deleting) {
      getCorgis(user.accountId);
    }
  }, [user, getCorgis, created, deleting]);

  return (
    <div className='App'>
      <Router hashType='noslash'>
        <Header />
        <Routes />
        <Footer />
      </Router>
    </div>
  );
};

export default App;
