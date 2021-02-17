import React from 'react';

import './CorgiCard.scss';

import { CorgiSVG, Quote } from '~modules/common';

import { CorgiTypeShape } from '~types/CorgiTypes';
import { CardSizeType } from '~types/CardSizeType';
import { SAUSAGE } from '~constants/corgi';

const CorgiCardPropTypes = {
  corgi: CorgiTypeShape.isRequired,
  size: CardSizeType,
};

const CorgiCard = ({ corgi, size = 'small' }) => {
  const { background_color, color, quote } = corgi;

  return (
    <div className='corgi-card' style={{ background_color }}>
      <div className='corgi-card__quote'>
        <Quote quoteId={quote} color={color} size={size} />
      </div>

      <CorgiSVG color={color} sausage={SAUSAGE[corgi.rate] || SAUSAGE.COMMON} />
    </div>
  );
};

CorgiCard.propTypes = CorgiCardPropTypes;

export default CorgiCard;
