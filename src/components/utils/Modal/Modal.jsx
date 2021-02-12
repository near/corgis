import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import './Modal.scss';

import { ReactChildrenType } from '../../../types/ReactChildrenType';

const ModalPropTypes = {
  show: PropTypes.bool.isRequired,
  Close: PropTypes.func.isRequired,
  children: ReactChildrenType,
};

const Modal = ({ show, Close, children }) => (
  <div>
    {show && <div className='backdrop' onClick={Close}></div>}
    <div className={classNames('modal', { 'modal--show': show })}>{children}</div>
  </div>
);

Modal.propTypes = ModalPropTypes;

export default Modal;
