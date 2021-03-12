/* global localStorage:true */
import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import './MintingPage.scss';

import { CharacterContext, ContractContext } from '~contexts';

import { MintingAnimation, MintingDescription, MintingForm, MintingScreen } from '~modules/minting/components';

const MintingPage = () => {
  const { corgis, creating, created } = useContext(ContractContext);
  const { generateRandomCharacter } = useContext(CharacterContext);

  const [isAnimPlaying, setIsAnimPlaying] = useState(creating);
  const [createdCorgiId, setCreatedCorgiId] = useState(null);

  useEffect(() => {
    const userCorgis = localStorage.getItem('userCorgis');

    if (userCorgis) {
      const { ids } = JSON.parse(userCorgis);

      if (creating || ids.length) {
        setIsAnimPlaying(true);
      }

      if (corgis) {
        if (corgis.length && ids.length !== 0) {
          if (ids.length !== corgis.length) {
            const newId = corgis.reduce((curr, next) => (!ids.includes(next.id) ? next.id : curr), null);

            if (newId) {
              setCreatedCorgiId(newId);
            }
          }
        } else if (corgis.length === 1 && ids.length === 0) {
          setCreatedCorgiId(corgis[0].id);
        }
      }
    }
  }, [corgis, creating]);

  useEffect(() => {
    generateRandomCharacter();
  }, [created]);

  /* eslint-disable-next-line arrow-body-style */
  useEffect(() => {
    return () => {
      localStorage.removeItem('userCorgis');
    };
  }, []);

  if (creating) {
    localStorage.setItem('userCorgis', JSON.stringify({ ids: corgis ? corgis.map((corgi) => corgi.id) : [] }));
  }

  if (createdCorgiId) {
    return <Redirect to={`/corgi/${createdCorgiId}`} />;
  }

  return (
    <div className='minting'>
      <h1 className='minting__title'>{creating ? 'Minting...' : 'Create a Corgi'}</h1>

      {isAnimPlaying ? (
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
