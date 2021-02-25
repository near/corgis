import React from 'react';

import './Header.scss';

import { CorgisLogo, Nav } from '~modules/header';

const Header = () => {
  return (
    <header className='header'>
      <CorgisLogo />
      <Nav />
    </header>
  );
};

export default Header;
