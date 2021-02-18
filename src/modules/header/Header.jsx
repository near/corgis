import React, { useContext } from 'react';

import './Header.scss';

import { ContractContext, NearContext } from '~contexts';

import Nav from './Nav/Nav';
import CorgisLogo from './CorgisLogo/CorgisLogo';

import { Button } from '~modules/common';

const Header = () => {
  const { user, signIn, signOut } = useContext(NearContext);
  const { corgis } = useContext(ContractContext);

  const signInAction = () => {
    signIn();
  };

  const signOutAction = () => {
    signOut();
  };

  return (
    <header className='header'>
      <div className='header__logo'>
        <CorgisLogo />
      </div>

      {user ? (
        <Nav accountName={user.accountId} number={corgis ? corgis.length : '...'} requestSignOut={signOutAction} />
      ) : (
        <Button description='Get Started' action={signInAction} />
      )}
    </header>
  );
};

export default Header;
