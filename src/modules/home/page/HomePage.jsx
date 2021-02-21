import React, { useContext, useEffect } from 'react';

import './HomePage.scss';

import { ContractContext, NearContext } from '~contexts';

import { Poster } from '~modules/home/components';
import { CorgisShowCase } from '~modules/common';

const HomePage = () => {
  const { user, signIn } = useContext(NearContext);
  const { getDisplayCorgis, displayCorgis } = useContext(ContractContext);

  const requestSignIn = () => {
    signIn();
  };

  useEffect(() => {
    getDisplayCorgis();
  }, [getDisplayCorgis]);

  return (
    <div className='home'>
      <Poster requestSignIn={requestSignIn} user={user} />

      <div className='home__showcase'>
        <CorgisShowCase corgis={displayCorgis} showRarity showOwner />
      </div>
    </div>
  );
};

export default HomePage;
