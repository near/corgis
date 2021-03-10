import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './Nav.scss';

import classNames from 'classnames';

import { ContractContext, MarketplaceContext, NearContext } from '~contexts';

import { Button, Dropdown, ExternalLink, MintingLink } from '~modules/common';

const Nav = () => {
  const { nearContent, user, signIn, signOut } = useContext(NearContext);
  const { corgis } = useContext(ContractContext);
  const { corgisForSale } = useContext(MarketplaceContext);

  const signInAction = () => {
    signIn();
  };

  const signOutAction = () => {
    signOut();
  };

  return (
    <nav className={classNames('nav', { 'nav--unauth': !user })}>
      {user ? (
        <>
          <div className='nav__item nav__item--minting'>
            <MintingLink />
          </div>

          <div className='nav__item nav__item--corgis'>
            <Link to={`/user/${user.accountId}`}>
              <Button description='My Corgis' badge={corgis ? corgis.length : 0} stretchable />
            </Link>
          </div>

          <div className='nav__item nav__item--marketplace'>
            <Link to='/marketplace'>
              <Button description='Marketplace' badge={corgisForSale ? corgisForSale.length : 0} stretchable />
            </Link>
          </div>

          <div className='nav__item nav__item--dropdown'>
            <Dropdown title={`@${user.accountId}`} stretchable>
              <ExternalLink
                customClasses='nav__link'
                description='Wallet'
                href={nearContent.config.walletUrl}
                rel='noopener noreferrer'
                target='_blank'
              />

              <Link className='nav__link' to='#' onClick={() => signOutAction()}>
                Sign out
              </Link>
            </Dropdown>
          </div>
        </>
      ) : (
        <>
          <div className='nav__item'>
            <Link to='/marketplace'>
              <Button description='Marketplace' badge={corgisForSale ? corgisForSale.length : 0} />
            </Link>
          </div>

          <div className='nav__item'>
            <Button description='Login with NEAR' action={signInAction} />
          </div>
        </>
      )}
    </nav>
  );
};

export default Nav;
