import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AccountPage from './modules/account/page/AccountPage';
import HomePage from './modules/home/page/HomePage';
import GenerationPage from './modules/generation/page/GenerationPage';
import ProfilePage from './modules/profile/page/ProfilePage';
import SharePage from './modules/share/page/SharePage';
import CorgiPage from './modules/corgi/page/CorgiPage';

const Routes = () => (
  <Switch>
    <Route exact path='/'>
      <HomePage />
    </Route>
    <Route exact path='/generation'>
      <GenerationPage />
    </Route>
    <Route exact path='/account'>
      <AccountPage />
    </Route>
    <Route exact path='/profile'>
      <ProfilePage />
    </Route>
    <Route exact path='/@:name'>
      <CorgiPage />
    </Route>
    <Route exact path='/share'>
      <SharePage />
    </Route>
    <Route>
      <h1>Not found This page. Please go back to continue or you can contact us about the issue.</h1>
    </Route>
  </Switch>
);

export default Routes;
