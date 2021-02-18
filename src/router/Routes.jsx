import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import { NearContext } from '~context/NearContext';

import GuardedRoute from '~router/GuardedRoute';

import AccountPage from '~modules/account/page/AccountPage';
import HomePage from '~modules/home/page/HomePage';
import GenerationPage from '~modules/generation/page/GenerationPage';
import ProfilePage from '~modules/profile/page/ProfilePage';
import SharePage from '~modules/share/page/SharePage';
import CorgiPage from '~modules/corgi/page/CorgiPage';

const Routes = () => {
  const { user } = useContext(NearContext);

  const isAuthenticated = !!user;

  return (
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <GuardedRoute auth={isAuthenticated} exact path='/generation'>
        <GenerationPage />
      </GuardedRoute>
      <GuardedRoute auth={isAuthenticated} exact path='/account'>
        <AccountPage />
      </GuardedRoute>
      <GuardedRoute auth={isAuthenticated} exact path='/profile'>
        <ProfilePage />
      </GuardedRoute>
      <GuardedRoute auth={isAuthenticated} path='/corgi/:id+'>
        <CorgiPage />
      </GuardedRoute>
      <GuardedRoute auth={isAuthenticated} exact path='/share'>
        <SharePage />
      </GuardedRoute>
      <Route>
        <h1>Not found This page. Please go back to continue or you can contact us about the issue.</h1>
      </Route>
    </Switch>
  );
};

export default Routes;
