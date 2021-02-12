import React from 'react';
import { Link } from 'react-router-dom';

import './CorgisLogo.scss';

import logo from '../../../assets/images/logo.png';

const CorgisLogo = () => {
  return (
    <Link to='/'>
      <img className='logo' src={logo} style={{ minWidth: '100px', width: '60%' }} alt='' />
    </Link>
  );
};

export default CorgisLogo;
