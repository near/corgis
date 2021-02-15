/* global document:true */
import React from 'react';
import ReactDOM from 'react-dom';

import * as nearlib from 'near-api-js';
import getConfig from './config';

import { NearContextProvider } from './context/NearContext';
import { ContractContextProvider } from './context/contract';
import { CharacterContextProvider } from './context/character';

import App from './App';

// Initializing contract
async function InitContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || 'development');

  // Initializing connection to the NEAR
  const near = await nearlib.connect({
    deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() },
    ...nearConfig,
  });

  // Needed to access wallet
  const walletConnection = new nearlib.WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  // Initializing our contract APIs by contract name and configuration.
  const contract = new nearlib.Contract(walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_corgi_by_id', 'get_corgis_by_owner', 'get_global_corgis'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['transfer_corgi', 'create_corgi', 'delete_corgi'],
    // Sender is the account ID to initialize transactions.
    sender: walletConnection.getAccountId(),
  });
  return {
    contract,
    currentUser,
    nearConfig,
    walletConnection,
    near,
  };
}

window.nearInitPromise = InitContract()
  .then(({ contract, currentUser, nearConfig, walletConnection, near }) => {
    const app = (
      <NearContextProvider currentUser={currentUser} nearConfig={nearConfig} wallet={walletConnection} near={near}>
        <ContractContextProvider Contract={contract}>
          <CharacterContextProvider>
            <App />
          </CharacterContextProvider>
        </ContractContextProvider>
      </NearContextProvider>
    );

    ReactDOM.render(app, document.getElementById('root'));
  })
  .catch(console.error);
