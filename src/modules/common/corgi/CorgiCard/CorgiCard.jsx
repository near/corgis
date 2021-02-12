import React from 'react';

import './CorgiCard.scss';

import { CorgiSVG, Quote } from '~modules/common';

import { CorgiTypeShape } from '~types/CorgiTypes';
import { CardSizeType } from '~types/CardSizeType';

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

      <CorgiSVG color={color} sausage={sausage} />
    </div>
  );
};

CorgiCard.propTypes = CorgiCardPropTypes;

export default CorgiCard;
