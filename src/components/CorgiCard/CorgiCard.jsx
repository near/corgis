import React from 'react';

import './CorgiCard.scss';

import Corgi from './Corgi/Corgi';

import { Quote } from '../utils/Quote/Quote';

import { CorgiTypeShape } from '../../types/CorgiTypes';
import { CardSizeType } from '../../types/CardSizeType';

const CorgiCardPropTypes = {
  corgi: CorgiTypeShape.isRequired,
  size: CardSizeType,
};

const CorgiCard = ({ corgi, size = 'small' }) => {
  const { backgroundColor, color, quote, sausage } = corgi;

  return (
    <div className='corgi-card' style={{ backgroundColor }}>
      <div className='corgi-card__quote'>
        <Quote text={quote} color={color} size={size} />
      </div>
      <Corgi color={color} sausage={sausage} />
    </div>
  );
};

CorgiCard.propTypes = CorgiCardPropTypes;

export default CorgiCard;
