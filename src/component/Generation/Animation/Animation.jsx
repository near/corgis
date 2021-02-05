import React from 'react';

import { CorgiFour } from '../../utils/corgiAnimation';

import raritySample from '../../../assets/images/rarity-sample.svg';
import shadow from '../../../assets/images/shadow.svg';

import { CorgiType } from '../../../types/corgi';

const Animation = ({ color, backgroundColor }) => (
  <div>
    <h3>Generating...</h3>
    <div className='back' style={{ background: backgroundColor }}>
      <div className='box bounce-7'>
        <CorgiFour color={color} />
      </div>
      <div className='shadow shadow-7'>
        <img src={shadow} alt='' />
      </div>
    </div>
    <img src={raritySample} alt='' style={{ width: '100%', maxWidth: '800px' }} />
    <style>{`
          .shadow {
            width: 100%;
            margin: auto;
            animation-duration: 2s;
            animation-iteration-count: infinite;
          }
          .back {
            border-radius: 10px;
            height: 50%;
            max-width: 900px;
            margin: 20px auto;
            padding: 20px;
          }
          .box {
            animation-duration: 2s;
            animation-iteration-count: infinite;
            transform-origin: bottom;
          }
          .bounce-7 {
            animation-name: bounce-7;
            animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
          }
          .shadow-7 {
            animation-name: shadow-7;
          }
          @keyframes bounce-7 {
              0%   { transform: scale(1,1)      translateY(0); }
              10%  { transform: scale(1.1,.9)   translateY(0); }
              30%  { transform: scale(.9,1.1)   translateY(-100px); }
              50%  { transform: scale(1.05,.95) translateY(0); }
              57%  { transform: scale(1,1)      translateY(-7px); }
              64%  { transform: scale(1,1)      translateY(0); }
              100% { transform: scale(1,1)      translateY(0); }
          }
          @keyframes shadow-7 {
            0%   { transform: scale(1,1)      translateY(0); }
            10%  { transform: scale(1.1,.9)   translateY(0); }
            30%  { transform: scale(.9,1.1)   translateY(0); }
            50%  { transform: scale(1.05,.95) translateY(0); }
            57%  { transform: scale(1,1)      translateY(0); }
            64%  { transform: scale(1,1)      translateY(0); }
            100% { transform: scale(1,1)      translateY(0); }
        }
        `}</style>
  </div>
);

Animation.propTypes = {
  backgroundColor: CorgiType.backgroundColor,
  color: CorgiType.color,
};

export default Animation;
