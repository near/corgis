import React, { useContext } from 'react';

import './MintingScreen.scss';

import tinycolor from 'tinycolor2';
import { CharacterContext } from '~contexts';

import { Egg } from '~modules/common';

const MintingScreen = () => {
  const { color, backgroundColor } = useContext(CharacterContext);

  const textColor = tinycolor.mostReadable(backgroundColor, [color, '#fff', '#000']).toHexString();

  return (
    <div className='minting-screen' style={{ backgroundColor, color: textColor }}>
      <Egg color={color} showShadow={true} />
    </div>
  );
};

export default MintingScreen;
