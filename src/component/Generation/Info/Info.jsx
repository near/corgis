import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { GiGreekSphinx, GiBeachBall } from 'react-icons/gi';

import useCharacter from '../../../context/character';
import { ContractContext } from '../../../context/contract';

import Button from '../../utils/Button';

import { CorgiType } from '../../../types/corgi';

const generate = require('project-name-generator');
const randomColor = require('randomcolor');

const Info = ({ setColor, color, setBackgroundColor, backgroundColor }) => {
  const { name, quote, setName, setQuote } = useCharacter();
  useEffect(() => setQuote(), [setQuote]);
  const useContract = useContext(ContractContext);
  const { createCorgi } = useContract;

  const generateName = (e) => {
    setName(e.target.value);
  };
  const generateRandomName = () => {
    const newName = generate({ words: 2, alliterative: true }).spaced;
    setName(newName);
  };
  const generateColor = (e) => {
    setColor(e.target.value);
  };
  const generateBackgroundColor = (e) => {
    setBackgroundColor(e.target.value);
  };
  const generateRandomColor = () => {
    const newColor = randomColor();
    const newBackgroundColor = randomColor();
    setColor(newColor);
    setBackgroundColor(newBackgroundColor);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    createCorgi(name, color, backgroundColor, quote);
  };
  return (
    <div className='inputboard'>
      <form onSubmit={onSubmit}>
        <p className='title'>My Corgi is called</p>
        <GiGreekSphinx onClick={generateRandomName} className='icon' />
        <div>
          <input className='inputname' type='text' value={name} onChange={generateName} required />
        </div>
        <p className='title'>Colors</p>
        <GiBeachBall onClick={generateRandomColor} className='icon' />
        <div>
          <div className='colorpicker'>
            <label>
              <div className='result' style={{ backgroundColor: color }}>
                <input
                  type='color'
                  id='colorPicker'
                  value={color}
                  onChange={generateColor}
                  style={{ display: 'none' }}
                />
                <div className='select'>w</div>
              </div>
            </label>
            <div>
              <p className='icon-title'>Corgi</p>
              <p className='icon-text'>{color}</p>
            </div>
          </div>
          <div className='colorpicker'>
            <label>
              <div className='result' style={{ backgroundColor }}>
                <input
                  type='color'
                  id='backgroundcolorPicker'
                  value={backgroundColor}
                  onChange={generateBackgroundColor}
                  style={{ display: 'none' }}
                />
                <div className='select'>w</div>
              </div>
            </label>
            <div>
              <p className='icon-title'>Background</p>
              <p className='icon-text'>{backgroundColor}</p>
            </div>
          </div>
        </div>
        <Button description='Generate Corgi' />
      </form>
      <p className='quote'>
        This will create a one-of-a-kind Corgi that will develop a unique size and thought process. The size it grows to
        will untimately determine it’s value
      </p>
      <style>{`
            .inputboard {
                background: #f8f8f8;
                border-radius: 10px;
                padding: 1%;
                text-align: left;
                width: 50%;
                margin: 1%;
              }
              
              .title {
                font-weight: 600;
                font-size: 1.5em;
                margin: 10px 0;
                display: block;
              }
              
              .inputname {
                background: #ffffff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                border-radius: 5px;
                width: 80%;
              }
              
              .quote {
                  font-size: 0.7em;
                  font-weight: thin;
                  display: inline-block;
                  margin-top: 20px;
              }
              
              @media all and (max-width: 765px) {
                .inputboard{
                  width: 100%;
                }
              }
              .colorpicker {
                display: flex;
                flex-flow: row;
              }
              
              .result{
                border: 2px solid #24272a;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                border-radius: 5px;
                width: 50px;
                height: 50px;
                cursor: grab;
              }
              
              #color-picker {
                display: none;
              }
              
              .select {
                cursor: pointer;
                position: relative;
                left: 29px;
                top: 24px;
                z-index: 10;
              }

              .icon-title {
                  margin: 0 2px;
                  font-weight: 600;
              }

              .icon-text {
                margin-top: 0;
                margin-left: 2px;
              }

              .icon {
                margin-top: 10px;
                color: #a51cea;
                font-size: 1.5rem;
                border-radius: 50%;
                box-shadow:0 0 4px 4px rgba(0, 0, 0, 0.5), inset 0 0 5px 2px #ffffff;
                background: #f5ebff;
                cursor: pointer;
              }
            `}</style>
    </div>
  );
};

Info.propTypes = {
  setColor: PropTypes.func.isRequired,
  color: CorgiType.color,
  setBackgroundColor: PropTypes.func.isRequired,
  backgroundColor: CorgiType.backgroundColor,
};

export default Info;
