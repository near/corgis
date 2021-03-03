import React from 'react';
import PropTypes from 'prop-types';

import './CorgiCard.scss';

import classNames from 'classnames';

import { CorgiActionsContextProvider } from '~contexts';

import { Activity, CorgiLink, CorgiSVG, Quote, RarityString } from '~modules/common/corgi';

import { SAUSAGE } from '~constants/corgi';

import { CorgiTypeShape } from '~types/CorgiTypes';
import CorgiActions from '~modules/common/corgi/actions/CorgiActions';

const CorgiCardPropTypes = { corgi: CorgiTypeShape.isRequired, hideActions: PropTypes.bool, big: PropTypes.bool };

const CorgiCard = ({ corgi, hideActions = false, big = false }) => {
  const { id, background_color, color, quote, name, rate, owner, sender, created, modified } = corgi;

  return (
    <div className={classNames('corgi-card', { 'corgi-card--big': big })}>
      <div className='corgi-card__header'>
        <RarityString rate={rate} />

        {!hideActions && (
          <CorgiActionsContextProvider corgi={corgi}>
            <CorgiActions isDropdown />
          </CorgiActionsContextProvider>
        )}
      </div>

      <CorgiLink id={id}>
        <div className='corgi-card__image' style={{ backgroundColor: background_color }}>
          <CorgiSVG color={color} sausage={SAUSAGE[rate] || SAUSAGE.COMMON} />
        </div>
      </CorgiLink>

      <div className='corgi-card__body'>
        <CorgiLink id={id}>
          <h5 className='corgi-card__name'>{name}</h5>
        </CorgiLink>
        <Quote id={quote} />
      </div>

      <div className='corgi-card__footer'>
        <Activity created={created} modified={modified} owner={owner} sender={sender} />
      </div>
    </div>
  );
};

CorgiCard.propTypes = CorgiCardPropTypes;

export default CorgiCard;
