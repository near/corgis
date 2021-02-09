import React, { useContext, useEffect } from 'react';

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
    <div className='Dash'>
      <Poster requestSignIn={signIn} isLoading={nearContext.isLoading} user={nearContext.user} />
      <ShowCase displayCorgis={displayCorgis} />
      <style>{`
            .Dash {
                width: 100%;
                margin: auto;
                display: grid;
                text-align: center;
            }
        `}</style>
    </div>
  );
};

export default Dash;
