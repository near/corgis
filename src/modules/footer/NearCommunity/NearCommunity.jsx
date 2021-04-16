import React from 'react';

import './NearCommunity.scss';

import { ExternalLink } from '~modules/common';

const NearCommunity = () => (
  <div className='community'>
    <h3 className='community__title'>Need Help?</h3>

    <ExternalLink
      customClasses='community__link'
      description='Join Community'
      href='https://near.chat/'
      rel='noopener noreferrer'
      target='_blank'
      underlineOnHover
    />
  </div>
);

export default NearCommunity;
