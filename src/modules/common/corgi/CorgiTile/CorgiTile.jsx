import React from 'react';
import PropTypes from 'prop-types';

import './CorgiTile.scss';

import { CorgiCard } from '~modules/common';

import { CorgiTypeShape } from '~types/CorgiTypes';
import { ReactChildrenType } from '~types/ReactChildrenType';

const CorgiTilePropTypes = {
  corgi: CorgiTypeShape,
  description: PropTypes.string,
  children: ReactChildrenType,
};

const CorgiTile = ({ corgi, description, children }) => (
  <div className='corgi-tile'>
    <div className='corgi-tile__card'>
      <CorgiCard corgi={corgi} size='small' />
    </div>

    <p className='corgi-tile__name'>{corgi.name}</p>
    <p className='corgi-tile__description'>{children || description || `§ ${corgi.rate}`}</p>
  </div>
);

CorgiTile.propTypes = CorgiTilePropTypes;

export default CorgiTile;
