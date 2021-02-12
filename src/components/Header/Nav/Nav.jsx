import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Nav.scss';

import Button from '../../utils/Button/Button';
import Dropdown from '../../Dropdown/Dropdown';
import GenerationLink from './GenerationLink/GenerationLink';

const NavPropTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accountName: PropTypes.string.isRequired,
  requestSignOut: PropTypes.func.isRequired,
};

const Nav = ({ number, accountName, requestSignOut }) => (
  <nav className='nav'>
    <div className='nav__account'>
      <Link to='/account'>
        <Button description={`My Corgis ( ${number} )`} />
      </Link>
      <Dropdown dropdownTitle={`@${accountName}▾`}>
        <Link to='/profile'>
          <button>Edit Profile</button>
        </Link>
        <button onClick={requestSignOut}>Sign Out</button>
      </Dropdown>
    </div>
    <Link to='/generation'>
      <GenerationLink />
    </Link>
  </nav>
);
Nav.propTypes = NavPropTypes;

export default Nav;
