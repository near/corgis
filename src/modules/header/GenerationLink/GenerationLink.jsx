import React from 'react';
import { Link } from 'react-router-dom';

import './GenerationLink.scss';

import IconNav from '~assets/images/icon-nav.svg';

const GenerationLink = () => (
  <Link to='/generation'>
    <div className='generation-link'>
      <img className='generation-link__icon' src={IconNav} alt='' />
    </div>
  </Link>
);

export default GenerationLink;
