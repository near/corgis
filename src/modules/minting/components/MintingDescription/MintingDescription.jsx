import React from 'react';

import './MintingDescription.scss';

const MintingDescription = () => (
  <div className='minting-description'>
    <ul className='minting-description__list'>
      <li className='minting-description__item'>
        <p className='minting-description__text'>Choose a name and a few colors and we’ll do the rest.</p>
      </li>
      <li className='minting-description__item'>
        <p className='minting-description__text'>
          This will create a one-of-a-kind Corgi that will develop a unique size and thought minting process. The size
          it grows to will untimately determine it’s value.
        </p>
      </li>
      <li className='minting-description__item'>
        <p className='minting-description__text'>
          All corgis come equipped with built-in cuteness and an unlimited capacity to love.
        </p>
      </li>
      <li className='minting-description__item'>
        <p className='minting-description__text'>
          Once minted, you can gift, trade and share your Corgi, or just keep it forever.{' '}
        </p>
      </li>
    </ul>
  </div>
);

export default MintingDescription;
