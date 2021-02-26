import React, { useContext } from 'react';

import './MintingAnimation.scss';

import shadow from '~assets/images/shadow.svg';

import { CharacterContext } from '~contexts';

import { CorgiAnimFour } from '~modules/common';

const MintingAnimation = () => {
  const { color, backgroundColor } = useContext(CharacterContext);

  return (
    <div className='minting-animation' style={{ backgroundColor }}>
      <div className='minting-animation__corgi'>
        <CorgiAnimFour color={color} />
      </div>

      <div className='minting-animation__shadow'>
        <img src={shadow} alt='' />
      </div>
    </div>
  );
};

export default MintingAnimation;
