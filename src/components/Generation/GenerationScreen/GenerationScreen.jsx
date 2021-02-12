import React from 'react';

import './GenerationScreen.scss';

import Egg from '../../utils/Egg/Egg';

import { CorgiType } from '../../../types/CorgiTypes';

const tinycolor = require('tinycolor2');

const GenerationScreenPropTypes = {
  backgroundColor: CorgiType.backgroundColor,
  color: CorgiType.color,
};

const GenerationScreen = ({ backgroundColor, color }) => {
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

GenerationScreen.propTypes = GenerationScreenPropTypes;

export default GenerationScreen;
