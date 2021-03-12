import React from 'react';

import './Footer.scss';

import { NearCommunity, NearWatermark } from '~modules/footer';

const Footer = () => (
  <footer className='footer'>
    <div className='footer__watermark'>
      <NearWatermark />
    </div>

    <p className='footer__description'>
      Crypto Corgis was created to demonstrate the NFT capabilities of NEAR Protocol.
    </p>

    <div className='footer__community'>
      <NearCommunity />
    </div>
  </footer>
);

export default Footer;
