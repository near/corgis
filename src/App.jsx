import 'regenerator-runtime/runtime';

import React, { useContext, useEffect } from 'react';

import './App.scss';

import { ContractContext, MarketplaceContext, NearContext } from '~contexts';

import Routes from '~router/Routes';

import { Footer } from '~modules/footer';

const App = () => {
  const { user } = useContext(NearContext);
  const { created, deleted, transfered, getCorgisByCurrentUser, getGlobalCorgis } = useContext(ContractContext);
  const { added, bidded, cleared, getCorgisForSale } = useContext(MarketplaceContext);

  useEffect(() => {
    if (user && ((!created && !deleted && !transfered) || (!added && !bidded && !cleared))) {
      getCorgisByCurrentUser();
    }
  }, [user, created, deleted, transfered, added, bidded, cleared]);

  useEffect(() => {
    if (!added && !bidded && !cleared) {
      getCorgisForSale();
    }
  }, [added, bidded, cleared]);

  useEffect(() => {
    if ((!created && !deleted && !transfered) || (!added && !bidded && !cleared)) {
      getGlobalCorgis();
    }
  }, [created, deleted, transfered, added, bidded, cleared]);

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
