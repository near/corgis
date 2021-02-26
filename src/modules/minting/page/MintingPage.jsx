import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import './MintingPage.scss';

import { CharacterContext, ContractContext } from '~contexts';

import { MintingAnimation, MintingDescription, MintingForm, MintingScreen } from '~modules/minting/components';

const MintingPage = () => {
  const { creating, created } = useContext(ContractContext);
  const { generateRandomCharacter } = useContext(CharacterContext);

  useEffect(() => {
    generateRandomCharacter();
  }, [created]);

  if (created) {
    return <Redirect to='/account' />;
  }

  return (
    <div className='minting'>
      <h1 className='minting__title'>{creating ? 'Generating...' : 'Create a Corgi'}</h1>

      {creating ? (
        <MintingAnimation />
      ) : (
        <div className='minting__field'>
          <div className='minting__form'>
            <MintingForm />
          </div>

          <div className='minting__screen'>
            <MintingScreen />
          </div>

          <div className='minting__description'>
            <MintingDescription />
          </div>
        </div>
      )}
    </div>
  );
};

export default MintingPage;
