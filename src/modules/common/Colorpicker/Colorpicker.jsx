import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './Colorpicker.scss';

import classNames from 'classnames';

import { SketchPicker } from 'react-color';

import { useDetectClickOutside } from '~hooks/';

const ColorpickerPropTypes = {
  title: PropTypes.string,
  color: PropTypes.string.isRequired,
  pickColor: PropTypes.func.isRequired,
};

const Colorpicker = ({ title, color, pickColor }) => {
  const buttonRef = useRef(null);

  const [isOpened, setIsOpened] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const openColorpicker = (event) => {
    event.preventDefault();

    if (buttonRef && buttonRef.current && event.target === buttonRef.current) {
      setCoords({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
    }

    setIsOpened(true);
  };

  const handleColor = (newColor) => {
    pickColor(newColor.hex);
  };

  useDetectClickOutside(buttonRef, () => setIsOpened(false));

  return (
    <div className='colorpicker'>
      <button
        ref={buttonRef}
        className='colorpicker__button'
        onClick={(event) => openColorpicker(event)}
        style={{ backgroundColor: color }}
      >
        <div
          className={classNames('colorpicker__window', { 'colorpicker__window--opened': isOpened })}
          style={{ top: coords.y, left: coords.x }}
        >
          <SketchPicker color={color} onChange={handleColor} disableAlpha />
        </div>
      </button>

      <p className='colorpicker__title'>{title || 'Colorpicker'}</p>
    </div>
  );
};

Colorpicker.propTypes = ColorpickerPropTypes;

export default Colorpicker;
