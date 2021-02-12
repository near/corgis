import React from 'react';
import PropTypes from 'prop-types';

import './ShareCard.scss';

const ShareCardPropTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  iconAlt: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const ShareCard = ({ onClick, icon, iconAlt, title, description }) => (
  <button className='share-card' onClick={() => onClick()}>
    <img className='share-card__icon' src={icon} alt={iconAlt || title} />
    <div className='share-card__content'>
      <h3 className='share-card__title'>{title}</h3>
      <p className='share-card__description'>{description}</p>
    </div>
  </button>
);

ShareCard.propTypes = ShareCardPropTypes;

export default ShareCard;
