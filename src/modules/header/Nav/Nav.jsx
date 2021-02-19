import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Nav.scss';

import { NearContext } from '~contexts/';

import { Button, Dropdown, ExternalLink } from '~modules/common';

import GenerationLink from '../GenerationLink/GenerationLink';

const NavPropTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accountName: PropTypes.string.isRequired,
  requestSignOut: PropTypes.func.isRequired,
};

const Nav = ({ number, accountName, requestSignOut }) => {
  const { nearContent } = useContext(NearContext);

  return (
    <nav className='nav'>
      <div className='nav__item'>
        <Link to='/account'>
          <Button description='My Corgis' badge={number} />
        </Link>
      </div>

      <div className='nav__item'>
        <Dropdown dropdownTitle={`@${accountName}`}>
          <ExternalLink
            description='Wallet'
            href={nearContent.config.walletUrl}
            rel='noopener noreferrer'
            target='_blank'
          />

          <a href='' onClick={() => requestSignOut()}>
            Sign out
          </a>
        </Dropdown>
      </div>

      <div className='nav__item'>
        <GenerationLink />
      </div>
    </nav>
  );
};

Nav.propTypes = NavPropTypes;

export default Nav;
