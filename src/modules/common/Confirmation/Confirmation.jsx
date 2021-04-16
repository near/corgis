import React from 'react';
import PropTypes from 'prop-types';

import './Confirmation.scss';

import { Button } from '~modules/common';

const ConfirmationPropTypes = { onConfirm: PropTypes.func, onReject: PropTypes.func };

const Confirmation = ({ onConfirm = () => {}, onReject = () => {} }) => (
  <div className='confirmation'>
    <div className='confirmation__button'>
      <Button description='Yes' action={(event) => onConfirm(event)} />
    </div>
    <div className='confirmation__button'>
      <Button description='No' action={(event) => onReject(event)} />
    </div>
  </div>
);

Confirmation.propTypes = ConfirmationPropTypes;

export default Confirmation;
