import 'regenerator-runtime/runtime';

import React, { useContext, useEffect } from 'react';

import './App.scss';

import { ContractContext, MarketplaceContext, NearContext } from '~contexts';

import Routes from '~router/Routes';

import { Footer } from '~modules/footer';

const App = () => {
  const { user } = useContext(NearContext);
  const { created, deleted, transfered, getCorgisByCurrentUser } = useContext(ContractContext);
  const { cleared, getCorgisForSale } = useContext(MarketplaceContext);

  useEffect(() => {
    if (user && ((!created && !deleted && !transfered) || cleared)) {
      getCorgisByCurrentUser();
    }
  }, [user, created, deleted, transfered, cleared]);

  useEffect(() => {
    getCorgisForSale();
  }, []);

  return (
    <div className='App'>
      <div className='page'>
        <Routes />
      </div>

      <Footer />
    </div>
  );
};

export default App;
