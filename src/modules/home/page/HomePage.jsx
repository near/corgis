import React, { useContext, useEffect } from 'react';

import './HomePage.scss';

import { ContractContext, NearContext } from '~contexts';

import { Poster, ShowCase } from '~modules/home/components';

const HomePage = () => {
  const nearContext = useContext(NearContext);
  const { getDisplayCorgis, displayCorgis } = useContext(ContractContext);

  const signIn = () => {
    nearContext.signIn();
  };

  useEffect(() => getDisplayCorgis(), [getDisplayCorgis]);

  return (
    <div className='home'>
      <Poster requestSignIn={signIn} user={nearContext.user} />
      <ShowCase corgis={displayCorgis} />
    </div>
  );
};

export default HomePage;
