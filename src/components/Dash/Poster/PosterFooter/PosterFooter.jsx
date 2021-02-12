import React from 'react';

import './PosterFooter.scss';

import raritySampleSVG from '../../../../assets/images/rarity-sample.svg';

const PosterFooter = () => {
  return (
    <div className='poster-footer'>
      <h2 className='poster-footer__title'>Corgis Display</h2>
      <img className='poster-footer__image' src={raritySampleSVG} alt='' />
    </div>
  );
};

export default PosterFooter;
