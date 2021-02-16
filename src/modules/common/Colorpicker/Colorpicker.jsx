import React from 'react';
import PropTypes from 'prop-types';

import './Colorpicker.scss';

const ColorpickerPropTypes = {
  title: PropTypes.string,
  color: PropTypes.string.isRequired,
  pickColor: PropTypes.func.isRequired,
};

const Colorpicker = ({ title, color, pickColor }) => {
  const handleColor = (event) => {
    pickColor(event.target.value);
  };

  return (
    <div className='colorpicker'>
      <label className='colorpicker__result' style={{ backgroundColor: color }}>
        <input className='colorpicker__input' type='color' value={color} onChange={(event) => handleColor(event)} />
      </label>

      <div className='colorpicker__description'>
        <p className='colorpicker__title'>{title || 'Colorpicker'}</p>
        <p className='colorpicker__hex'>{color}</p>
      </div>
    </div>
  );
};

Colorpicker.propTypes = ColorpickerPropTypes;

export default Colorpicker;
