import React, { useContext, useEffect } from 'react';

import './HomePage.scss';

import { ContractContext, NearContext } from '~contexts';

import { Poster } from '~modules/home/components';
import { CorgisShowCase } from '~modules/common';

const HomePage = () => {
  const { user, signIn } = useContext(NearContext);
  const { created, deleted, transfered, getGlobalCorgis, globalCorgis } = useContext(ContractContext);

  const requestSignIn = () => {
    signIn();
  };

  useEffect(() => {
    getGlobalCorgis();
  }, []);

  useEffect(() => {
    if (created || deleted || transfered) {
      getGlobalCorgis();
    }
  }, [created, deleted, transfered]);

  return (
    <div className='home'>
      <Poster requestSignIn={requestSignIn} user={user} />

      <div className='home__showcase'>
        <CorgisShowCase corgis={globalCorgis} title='Recent activity' />
      </div>
    </div>
  );
};

export default HomePage;
