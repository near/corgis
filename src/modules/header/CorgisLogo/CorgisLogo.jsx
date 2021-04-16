import React from 'react';
import { Link } from 'react-router-dom';

import './CorgisLogo.scss';

import logo from '~assets/images/logo.png';

const CorgisLogo = () => (
  <Link to='/#'>
    <img className='logo' src={logo} alt='' />
  </Link>
);

export default CorgisLogo;
