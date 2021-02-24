import React from 'react';

import './CorgiSpinner.scss';

import corgiCircle from '~assets/images/corgi-circle.png';

const CorgiSpinner = () => (
  <div className='spinner-wrapper'>
    <div className='spinner'>
      <div className='spinner__gradient'></div>
      <div className='spinner__background'></div>
      <img className='spinner__corgi' src={corgiCircle}></img>
    </div>
  </div>
);

export default CorgiSpinner;
