import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import { CharacterContextProvider, NearContext } from '~contexts';

import GuardedRoute from '~router/GuardedRoute';

import AccountPage from '~modules/account/page';
import CorgiPage from '~modules/corgi/page';
import HomePage from '~modules/home/page';
import MintingPage from '~modules/minting/page';
import SharePage from '~modules/share/page/SharePage';

const Routes = () => {
  const { user, isLoading } = useContext(NearContext);

  const isAuthenticated = !!user;

  return (
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <GuardedRoute auth={isAuthenticated} isLoading={isLoading} exact path='/minting'>
        <CharacterContextProvider>
          <MintingPage />
        </CharacterContextProvider>
      </GuardedRoute>
      <GuardedRoute auth={isAuthenticated} isLoading={isLoading} exact path='/account'>
        <AccountPage />
      </GuardedRoute>
      <GuardedRoute auth={isAuthenticated} isLoading={isLoading} path='/corgi/:id+'>
        <CorgiPage />
      </GuardedRoute>
      <GuardedRoute auth={isAuthenticated} isLoading={isLoading} exact path='/share'>
        <SharePage />
      </GuardedRoute>
      <Route>
        <h1>Not found This page. Please go back to continue or you can contact us about the issue.</h1>
      </Route>
    </Switch>
  );
};

export default Routes;
