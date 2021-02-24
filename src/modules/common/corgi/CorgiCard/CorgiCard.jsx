import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './CorgiCard.scss';

import { ActionsDropdown, Activity, CorgiSVG, Quote, RarityString } from '~modules/common/corgi';

import { SAUSAGE } from '~constants/corgi';

import { CorgiTypeShape } from '~types/CorgiTypes';

const CorgiCardPropTypes = { corgi: CorgiTypeShape.isRequired, showActions: PropTypes.bool };

const CorgiCard = ({ corgi, showActions = false }) => {
  const { id, background_color, color, quote, name, rate, owner, sender, created, modified } = corgi;

  return (
    <div className='corgi-card'>
      <div className='corgi-card__header'>
        <RarityString rate={rate} />

        {showActions && <ActionsDropdown id={id} />}
      </div>

      <Link to={`/corgi/${id}`}>
        <div className='corgi-card__image' style={{ backgroundColor: background_color }}>
          <CorgiSVG color={color} sausage={SAUSAGE[rate] || SAUSAGE.COMMON} />
        </div>
      </Link>

      <div className='corgi-card__body'>
        <h5 className='corgi-card__name'>{name}</h5>
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
