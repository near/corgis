import React from 'react';
import { Link } from 'react-router-dom';

import './CorgisLogo.scss';

import logo from '~assets/images/logo.png';

const CorgisLogo = () => (
  <Link to='/#'>
    <div className='logo'>
      <img className='logo__image' src={logo} alt='' />
    </div>
  </Link>
);

export default CorgisLogo;
