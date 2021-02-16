import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Nav.scss';

import { Button, Dropdown } from '~modules/common';
import GenerationLink from '../GenerationLink/GenerationLink';

const NavPropTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accountName: PropTypes.string.isRequired,
  requestSignOut: PropTypes.func.isRequired,
};

const Nav = ({ number, accountName, requestSignOut }) => (
  <nav className='nav'>
    <div className='nav__item'>
      <Link to='/account'>
        <Button description={`My Corgis ( ${number} )`} />
      </Link>
    </div>

    <div className='nav__item'>
      <Dropdown dropdownTitle={`@${accountName}▾`}>
        <Link to='/profile'>
          <button>Edit Profile</button>
        </Link>

        <button onClick={requestSignOut}>Sign Out</button>
      </Dropdown>
    </div>

    <div className='nav__item'>
      <GenerationLink />
    </div>
  </nav>
);

Nav.propTypes = NavPropTypes;

export default Nav;
