import React, { useContext } from 'react';

import './GenerationAnimation.scss';

import classNames from 'classnames';

import shadow from '~assets/images/shadow.svg';

import { CorgiAnimFour } from '~modules/common';

import { CharacterContext } from '~contexts';

const GenerationAnimation = () => {
  const { color, backgroundColor } = useContext(CharacterContext);

  return (
    <div className='generation-animation'>
      <h3 className='generation-animation__title'>Generating...</h3>

      <div className='generation-animation__background' style={{ backgroundColor }}>
        <div className={classNames('generation-animation__box', 'generation-animation__box--bounce-7')}>
          <CorgiAnimFour color={color} />
        </div>

        <div className={classNames('generation-animation__shadow', 'generation-animation__shadow--shadow-7')}>
          <img src={shadow} alt='' />
        </div>
      </div>
    </div>
  );
};

export default GenerationAnimation;
