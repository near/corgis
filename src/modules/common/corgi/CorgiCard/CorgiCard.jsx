import React from 'react';
import PropTypes from 'prop-types';

import './CorgiCard.scss';

import classNames from 'classnames';

import { CorgiSVG, Quote } from '~modules/common';

import { SAUSAGE } from '~constants/corgi';

import { CorgiTypeShape } from '~types/CorgiTypes';
import { CardSizeType } from '~types/CardSizeType';
import { ReactChildrenType } from '~types/ReactChildrenType';
import { Link } from 'react-router-dom';

const CorgiCardPropTypes = {
  corgi: CorgiTypeShape.isRequired,
  size: CardSizeType,
  description: PropTypes.string,
  children: ReactChildrenType,
  showOwner: PropTypes.bool,
  showRarity: PropTypes.bool,
};

const CorgiCard = ({ corgi, size = 'small', description, children, showOwner = false, showRarity = false }) => {
  const { id, background_color, color, quote, name, rate, owner } = corgi;

  const rateString = rate.indexOf('_') !== -1 ? rate.split('_').join(' ') : rate;

  return (
    <div className='corgi-card'>
      <Link to={`/corgi/${id}`}>
        <div className='corgi-card__image' style={{ backgroundColor: background_color }}>
          <div className='corgi-card__quote'>
            <Quote quoteId={quote} color={color} size={size} />
          </div>

          <CorgiSVG color={color} sausage={SAUSAGE[rate] || SAUSAGE.COMMON} />
        </div>
      </Link>

      <div className='corgi-card__body'>
        <p className='corgi-card__name'>{name}</p>

        {showRarity && (
          <p className={classNames('corgi-card__rarity', `corgi-card__rarity--${rate.toLowerCase()}`)}>{rateString}</p>
        )}

        {description && <p className='corgi-card__text'>{description}</p>}

        {children && <p className='corgi-card__content'>{children}</p>}

        {showOwner && (
          <p className='corgi-card__text corgi-card__text--owner'>
            Created by <span className='corgi-card__owner'>@{owner}</span>
          </p>
        )}
      </div>
    </div>
  );
};

CorgiCard.propTypes = CorgiCardPropTypes;

export default CorgiCard;
