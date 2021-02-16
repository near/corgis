import 'regenerator-runtime/runtime';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Routes from '~router/Routes';

import './App.scss';

import { Header } from '~modules/header';
import { Footer } from '~modules/footer';

const App = () => (
  <div className='App'>
    <Router>
      <Header />
      <Routes />
      <Footer />
    </Router>
  </div>
);

export default App;
