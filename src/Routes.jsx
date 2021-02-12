import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AccountPage from './components/AccountPage/AccountPage';
import Dash from './components/Dash/Dash';
import Generation from './components/Generation/Generation';
import Profile from './components/Profile/Profile';
import SharePage from './components/SharePage/SharePage';
import CorgiPage from './components/CorgiPage/CorgiPage';

const Routes = () => (
  <Switch>
    <Route exact path='/'>
      <Dash />
    </Route>
    <Route exact path='/generation'>
      <Generation />
    </Route>
    <Route exact path='/account'>
      <AccountPage />
    </Route>
    <Route exact path='/profile'>
      <Profile />
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
