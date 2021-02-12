/* eslint-disable max-len */
import React from 'react';

import { CorgiType } from '~types/CorgiTypes';

const CorgiAnimOnePropTypes = { color: CorgiType.color };

const CorgiAnimOne = ({ color }) => (
  <div style={{ width: '100%' }}>
    <svg
      width='192px'
      height='191px'
      viewBox='0 0 192 191'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xlink='http://www.w3.org/1999/xlink'
    >
      <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <g id='gen1' transform='translate(-759.000000, -1100.000000)'>
          <g id='c-phase1-(1)' transform='translate(761.000000, 1102.000000)'>
            <ellipse
              id='Oval'
              fill='#FFFFFF'
              fillRule='nonzero'
              cx='94.1730104'
              cy='93.5'
              rx='94.1730104'
              ry='93.5'
            ></ellipse>
            <path
              d='M94.1730104,-3.94860861e-06 C58.6531936,-0.00853773824 26.1503089,19.8263455 10.1170588,51.2951389 C16.3037024,74.3714583 31.2340484,96.2205903 66.9543945,81.1631944 C132.653149,53.4443403 181.930484,103.453854 85.5666436,114.868646 C9.23418685,123.913472 65.1755709,181.39 145.889689,171.65691 C180.684632,148.972844 196.352349,106.299441 184.423298,66.7047859 C172.494247,27.1101308 135.798593,-0.0119519835 94.1730104,-3.94860861e-06 Z'
              id='Path'
              fill={color}
              fillRule='nonzero'
            ></path>
            <ellipse
              id='Oval'
              stroke='#24272A'
              strokeWidth='2.6'
              cx='94.1730104'
              cy='93.5'
              rx='94.1730104'
              ry='93.5'
            ></ellipse>
          </g>
        </g>
      </g>
    </svg>
  </div>
);

CorgiAnimOne.propTypes = CorgiAnimOnePropTypes;

export default CorgiAnimOne;
