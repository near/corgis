import React from 'react';
import PropTypes from 'prop-types';

import './InfoTile.scss';

import StylesType from '~types/StylesType';

const InfoTilePropTypes = { text: PropTypes.string.isRequired, styles: StylesType };

const InfoTile = ({ text, styles }) => (
  <p className='infotile' style={styles}>
    {text}
  </p>
);

InfoTile.propTypes = InfoTilePropTypes;

export default InfoTile;
