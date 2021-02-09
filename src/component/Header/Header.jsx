import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import logo from '../../assets/images/logo.png';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';

import Nav from './Nav/Nav';
import Spinner from '../utils/Spinner';
import Button from '../utils/Button';

const Header = () => {
  const { user, isLoading, signIn, signOut } = useContext(NearContext);
  const { getCorgisList, corgis } = useContext(ContractContext);

  const signInAction = () => {
    signIn();
  };

  const signOutAction = () => {
    signOut();
  };

  useEffect(() => {
    if (!!user) {
      getCorgisList(user.accountId);
    }
  }, [getCorgisList, user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {!!user ? (
        <div className='header'>
          <NavLink exact to='/'>
            <img src={logo} style={{ minWidth: '100px', width: '70%' }} alt='' />
          </NavLink>
          <Nav accountName={user.accountId} number={corgis ? corgis.length : '...'} requestSignOut={signOutAction} />
        </div>
      ) : (
        <div className='header'>
          <NavLink exact to='/'>
            <img src={logo} style={{ minWidth: '100px', width: '60%' }} alt='' />
          </NavLink>
          <Button description='Get Started' action={signInAction} />
        </div>
      )}
      <style>{`
        .header {
            margin: 1% auto;
            padding: auto;
            display: flex;
            justify-content: space-between;
            width: 70%;
            max-width: 1000px;
        }
        
        @media all and (max-width: 751px) {
            .header{
                width: 90%;
                margin: 1% auto;
            }
        }
        
        @media all and (max-width: 376px) {
            .header{
                width: 90%;
                margin: 1% auto;
                flex-direction: column;
            }
        }    
    `}</style>
    </div>
  );
};

export default Header;
