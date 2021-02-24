import React from 'react';
import PropTypes from 'prop-types';

import './Popup.scss';

import classNames from 'classnames';

import { PopupType } from '~types/PopupTypes';

const PopupPropTypes = {
  isOpened: PropTypes.bool,
  ...PopupType,
};

const Popup = ({ isOpened = false, title, position = 'top', children }) => (
  <div className={classNames('popup', `popup--${position}`, { 'popup--opened': isOpened })}>
    {title && <h4 className='popup__title'>{title}</h4>}

    <div className='popup__content'>{children}</div>
  </div>
);

Popup.propTypes = PopupPropTypes;

export default Popup;
