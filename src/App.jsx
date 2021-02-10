import 'regenerator-runtime/runtime';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';

const App = () => (
  <div className='App'>
    <Router>
      <Header />
      <Routes />
      <Footer />
    </Router>
    <style>{`
        body {
          text-align: center;
          font-family: 'Poppins', sans-serif;
          position: relative;
          min-height: calc(100vh - 80px);
        }
        
        button {
          all: unset;
          outline:none;
        }
        
        input {
          all:unset;
          padding: 5px;
        }
      `}</style>
  </div>
);

export default App;
