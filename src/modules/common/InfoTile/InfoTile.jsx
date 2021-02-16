import React from 'react';
import PropTypes from 'prop-types';

import './InfoTile.scss';

const InfoTilePropTypes = { text: PropTypes.string.isRequired, style: PropTypes.style };

const InfoTile = ({ text, style }) => (
  <p className='infotile' style={style}>
    {text}
  </p>
);

InfoTile.propTypes = InfoTilePropTypes;

export default InfoTile;
