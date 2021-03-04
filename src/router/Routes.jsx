import React, { useContext } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { CharacterContextProvider, NearContext } from '~contexts';

import GuardedRoute from '~router/GuardedRoute';

import { CorgiPNG } from '~modules/common/corgi';

import { Header } from '~modules/header';
import { Footer } from '~modules/footer';

import CorgiPage from '~modules/corgi/page';
import HomePage from '~modules/home/page';
import MintingPage from '~modules/minting/page';
import UserPage from '~modules/user/page';

const Routes = () => {
  const { user, isLoading } = useContext(NearContext);

  const isAuthenticated = !!user;

  return (
    <Router hashType='noslash'>
      <Switch>
        <Route exact path='/assets/corgi/:id+'>
          <CorgiPNG />
        </Route>

        <Route>
          <Header />

          <Switch>
            <Route exact path='/'>
              <HomePage />
            </Route>
            <Route exact path='/corgi/:id+'>
              <CorgiPage />
            </Route>
            <Route exact path='/user/:id'>
              <UserPage />
            </Route>
            <GuardedRoute auth={isAuthenticated} isLoading={isLoading} exact path='/minting'>
              <CharacterContextProvider>
                <MintingPage />
              </CharacterContextProvider>
            </GuardedRoute>
            <Route>
              <h1>Not found This page. Please go back to continue or you can contact us about the issue.</h1>
            </Route>
          </Switch>

          <Footer />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
