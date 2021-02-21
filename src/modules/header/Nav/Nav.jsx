import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './Nav.scss';

import { ContractContext, NearContext } from '~contexts';

import { Button, Dropdown, ExternalLink } from '~modules/common';

import GenerationLink from '../GenerationLink/GenerationLink';

const Nav = () => {
  const { nearContent, user, signIn, signOut } = useContext(NearContext);
  const { corgis } = useContext(ContractContext);

  const signInAction = () => {
    signIn();
  };

  const signOutAction = () => {
    signOut();
  };

  return (
    <nav className='nav'>
      {user ? (
        <>
          <div className='nav__item'>
            <Link to='/account'>
              <Button description='My Corgis' badge={corgis ? corgis.length : 0} />
            </Link>
          </div>

          <div className='nav__item nav__item--expandable'>
            <Dropdown dropdownTitle={`@${user.accountId}`}>
              <ExternalLink
                customClasses='nav__link'
                description='Wallet'
                href={nearContent.config.walletUrl}
                rel='noopener noreferrer'
                target='_blank'
              />

              <Link className='nav__link' to='/' onClick={() => signOutAction()}>
                Sign out
              </Link>
            </Dropdown>
          </div>

          <div className='nav__item'>
            <GenerationLink />
          </div>
        </>
      ) : (
        <div className='nav__login'>
          <Button description='Login with NEAR' action={signInAction} />
        </div>
      )}
    </nav>
  );
};

export default Nav;
