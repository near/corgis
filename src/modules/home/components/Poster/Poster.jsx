import React from 'react';
import PropTypes from 'prop-types';

import './Poster.scss';

import corgiFull from '~assets/images/corgi-full.png';

import { Button, Spinner } from '~modules/common';
import { PosterFooter } from '~modules/home/components';

const PosterPropTypes = {
  requestSignIn: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // TODO: user type
  user: PropTypes.shape({ accountId: PropTypes.string.isRequired }),
};

const Poster = ({ requestSignIn, isLoading, user }) => {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='poster'>
      <div className='poster__background'>
        <div className='poster__text'>
          <p className='text1'>Create your own </p>
          <p className='text1'>one-of-the-kind</p>
          <p className='text1'>Corgi today</p>
          <p className='text2'>create, collect, send, or trade</p>
          {user ? (
            <div className='show'>Logged In {user.accountId}</div>
          ) : (
            <Button description='Login with NEAR' action={requestSignIn} />
          )}
        </div>
        <div className='poster__image'>
          <img src={corgiFull} alt='' style={{ width: '100%' }} />
        </div>
      </div>

      <PosterFooter />
    </div>
  );
};

Poster.propTypes = PosterPropTypes;

export default Poster;
