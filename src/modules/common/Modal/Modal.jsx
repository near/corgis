import React from 'react';
import PropTypes from 'prop-types';

import './Modal.scss';

import classNames from 'classnames';

import { ReactChildrenType } from '~types/ReactChildrenType';

const ModalPropTypes = {
  show: PropTypes.bool.isRequired,
  Close: PropTypes.func.isRequired,
  children: ReactChildrenType,
};

const Modal = ({ show, Close, children }) => (
  <div className={classNames('modal', { 'modal--show': show })}>
    <div className='modal__background' onClick={Close}></div>

    <div className='modal__content'>{children}</div>
  </div>
);

Modal.propTypes = ModalPropTypes;

export default Modal;
