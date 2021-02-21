import React from 'react';

import './Header.scss';

import Nav from './Nav/Nav';
import CorgisLogo from './CorgisLogo/CorgisLogo';

const Header = () => {
  return (
    <header className='header'>
      <CorgisLogo />
      <Nav />
    </header>
  );
};

export default Header;
