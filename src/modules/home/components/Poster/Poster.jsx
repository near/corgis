import React from 'react';
import PropTypes from 'prop-types';

import './Poster.scss';

import corgiFull from '~assets/images/corgi-full.png';

import { Button, InfoTile, Spinner } from '~modules/common';
import { PosterFooter } from '~modules/home/components';

const PosterPropTypes = {
  requestSignIn: PropTypes.func.isRequired,
  // TODO: user type
  user: PropTypes.shape({ accountId: PropTypes.string.isRequired }),
};

const Poster = ({ requestSignIn, user }) => (
  <div className='poster'>
    <div className='poster__background'>
      <div className='poster__description'>
        <p className='poster__text'>Create your own one-of-the-kind Corgi today</p>

        <p className='poster__text poster__text--small'>create, collect, send, or trade</p>

        <div className='poster__login'>
          {user ? (
            <InfoTile text={`Logged In as @${user.accountId}`} />
          ) : (
            <Button description='Login with NEAR' action={requestSignIn} />
          )}
        </div>
      </div>

      <div className='poster__image'>
        <img className='poster__corgi' src={corgiFull} alt='' />
      </div>
    </div>

    <PosterFooter />
  </div>
);

Poster.propTypes = PosterPropTypes;

export default Poster;
