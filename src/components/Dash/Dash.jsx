import React, { useContext, useEffect } from 'react';

import './Dash.scss';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';

import Poster from './Poster/Poster';
import ShowCase from './ShowCase/ShowCase';

const Dash = () => {
  const nearContext = useContext(NearContext);
  const { getDisplayCorgis, displayCorgis } = useContext(ContractContext);

  const signIn = () => {
    nearContext.signIn();
  };

  useEffect(() => getDisplayCorgis(), [getDisplayCorgis]);

  return (
    <div className='dash'>
      <Poster requestSignIn={signIn} isLoading={nearContext.isLoading} user={nearContext.user} />
      <ShowCase corgis={displayCorgis} />
    </div>
  );
};

export default Dash;
