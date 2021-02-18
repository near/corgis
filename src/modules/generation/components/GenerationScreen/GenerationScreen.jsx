import React, { useContext } from 'react';

import './GenerationScreen.scss';

import { Egg } from '~modules/common';

import { CharacterContext } from '~contexts';

import tinycolor from 'tinycolor2';

const GenerationScreen = () => {
  const { color, backgroundColor } = useContext(CharacterContext);

  const textColor = tinycolor.mostReadable(backgroundColor, [color, '#fff', '#000']).toHexString();

  return (
    <div className='generation-screen' style={{ backgroundColor, color: textColor }}>
      <p className='generation-screen__description'>
        All corgis come equipped with built-in cuteness and an unlimited capacity to love.
      </p>
      <p className='generation-screen__description'>Just choose a name and a few colors and we’ll do the rest.</p>

      <Egg color={color} showShadow={true} />
    </div>
  );
};

export default GenerationScreen;
