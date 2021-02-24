import React from 'react';
import PropTypes from 'prop-types';

import './Confirmation.scss';

import { Button } from '~modules/common';

const ConfirmationPropTypes = { onConfirm: PropTypes.func, onReject: PropTypes.func };

const Confirmation = ({ onConfirm = () => console.log('confirmed'), onReject = () => console.log('rejected') }) => (
  <div className='confirmation'>
    <div className='confirmation__button'>
      <Button description='Yes' action={() => onConfirm()} />
    </div>
    <div className='confirmation__button'>
      <Button description='No' action={() => onReject()} />
    </div>
  </div>
);

Confirmation.propTypes = ConfirmationPropTypes;

export default Confirmation;
