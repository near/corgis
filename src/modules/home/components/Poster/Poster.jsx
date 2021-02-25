import React from 'react';
import PropTypes from 'prop-types';

import './Poster.scss';

import corgiFull from '~assets/images/corgi-full.png';

import { Button } from '~modules/common';

const PosterPropTypes = {
  requestSignIn: PropTypes.func.isRequired,
  // TODO: user type
  user: PropTypes.shape({ accountId: PropTypes.string.isRequired }),
};

const Poster = ({ requestSignIn, user }) => (
  <div className='poster'>
    <div className='poster__description'>
      <p className='poster__text'>Create your own one&#8209;of&#8209;a&#8209;kind Corgi today</p>

      <p className='poster__text poster__text--small'>Mint, collect, gift and trade Corgis on Blockchain</p>

      {!user && <Button description='Get Started ' action={requestSignIn} />}
    </div>

    <div className='poster__image'>
      <img className='poster__corgi' src={corgiFull} alt='' />
    </div>
  </div>
);

Poster.propTypes = PosterPropTypes;

export default Poster;
