import React from 'react';

import './GenerationAnimation.scss';

import classNames from 'classnames';

import raritySample from '../../../assets/images/rarity-sample.svg';
import shadow from '../../../assets/images/shadow.svg';

import { CorgiFour } from '../../utils/corgiAnimation';

import { CorgiType } from '../../../types/CorgiTypes';

const GenerationAnimationPropTypes = {
  backgroundColor: CorgiType.backgroundColor,
  color: CorgiType.color,
};

const GenerationAnimation = ({ color, backgroundColor }) => (
  <div className='generation-animation'>
    <h3>Generating...</h3>
    <div className='generation-animation__background' style={{ background: backgroundColor }}>
      <div className={classNames('generation-animation__box', 'generation-animation__box--bounce-7')}>
        <CorgiFour color={color} />
      </div>

      <div className={classNames('generation-animation__shadow', 'generation-animation__shadow--shadow-7')}>
        <img src={shadow} alt='' />
      </div>
    </div>

    <img className='generation-animation__image' src={raritySample} alt='' />
  </div>
);

GenerationAnimation.propTypes = GenerationAnimationPropTypes;

export default GenerationAnimation;
