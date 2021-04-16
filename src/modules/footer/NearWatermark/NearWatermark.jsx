import React from 'react';

import './NearWatermark.scss';

import nearLogo from '~assets/images/near-logo.svg';

import { ExternalLink } from '~modules/common';

const NearWatermark = () => (
  <div className='watermark'>
    <a target='_blank' href='https://near.org/' rel='noopener noreferrer'>
      <img className='watermark__logo' src={nearLogo} alt='NEAR' />
    </a>

    <div className='watermark__description'>
      <div className='watermark__copyright'>© 2021 NEAR Inc. All Rights Reserved.</div>

      <div className='watermark__privacy'>
        <ExternalLink
          customClasses='watermark__link'
          description='Terms of Service'
          href='https://near.org/privacy/'
          rel='noopener noreferrer'
          target='_blank'
          showUnderline
        />

        <div className='watermark__divider'></div>

        <ExternalLink
          customClasses='watermark__link'
          description='Privacy Policy'
          href='https://near.org/privacy/'
          rel='noopener noreferrer'
          target='_blank'
          showUnderline
        />
      </div>
    </div>
  </div>
);

export default NearWatermark;
