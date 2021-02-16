import React, { useContext, useEffect } from 'react';

import './Header.scss';

import { NearContext } from '~context/NearContext';
import { ContractContext } from '~context/contract';

import Nav from './Nav/Nav';
import CorgisLogo from './CorgisLogo/CorgisLogo';

import { Button } from '~modules/common';

const Header = () => {
  const { user, signIn, signOut } = useContext(NearContext);
  const { getCorgisList, corgis } = useContext(ContractContext);

  const signInAction = () => {
    signIn();
  };

  const signOutAction = () => {
    signOut();
  };

  useEffect(() => {
    if (user) {
      getCorgisList(user.accountId);
    }
  }, [getCorgisList, user]);

  return (
    <div className='header'>
      <CorgisLogo />

      {user ? (
        <Nav accountName={user.accountId} number={corgis ? corgis.length : '...'} requestSignOut={signOutAction} />
      ) : (
        <Button description='Get Started' action={signInAction} />
      )}
    </div>
  );
};

export default Header;
