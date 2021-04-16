import React from 'react';
import PropTypes from 'prop-types';

import './TimeTile.scss';

import { formatToDisplay } from '~helpers/time';

const TimeTilePropTypes = {
  time: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

const TimeTile = ({ time, label }) => (
  <div className='time-tile'>
    {(time || time === 0) && <span className='time-tile__number'>{formatToDisplay(time)}</span>}
    {label && label.length && <span className='time-tile__label'>{label}</span>}
  </div>
);

TimeTile.propTypes = TimeTilePropTypes;

export default TimeTile;
