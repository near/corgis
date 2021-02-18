import 'regenerator-runtime/runtime';
import React, { useContext, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Routes from '~router/Routes';

import './App.scss';

import { Header } from '~modules/header';
import { Footer } from '~modules/footer';

import { ContractContext, NearContext } from '~contexts';

const App = () => {
  const { user } = useContext(NearContext);
  const { created, getCorgisList } = useContext(ContractContext);

  useEffect(() => {
    if (user) {
      getCorgisList(user.accountId);
    }
  }, [user, getCorgisList, created]);

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
