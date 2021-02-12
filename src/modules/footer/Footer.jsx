import React from 'react';

import './Footer.scss';

import classNames from 'classnames';

import nearLogo from '~assets/images/near_logo_stack.png';

const Footer = () => (
  <div className='footer'>
    <div className='footer__left'>
      <img src={nearLogo} alt='' style={{ height: '7em' }} />
      <div className='footer__decription'>
        <p className='footer__text'>Crypto Corgis was created to demonstrate the NFT</p>
        <p className='footer__text'>capabilities of NEAR Protocol. </p>
        <p className='footer__text'>
          Learn more at{' '}
          <a href='https://near.org/' target='_blank' rel='noopener noreferrer' className='blue'>
            near.org
          </a>
        </p>
      </div>
    </div>
    <div className='footer__right'>
      <p className='footer__text'>© 2019 Near Protocol </p>
      <p className='footer__text'>All Rights Reserved.</p>
      <p className={classNames('footer__text', 'footer__text--blue')}>
        Privacy Policy <span className={classNames('footer__text', 'footer__text--black')}> | </span> Terms of Use
      </p>
    </div>
  </div>
);

export default Footer;
