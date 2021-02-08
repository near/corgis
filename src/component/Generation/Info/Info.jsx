import React, { useContext } from 'react';

import { GiGreekSphinx, GiBeachBall } from 'react-icons/gi';

import randomColor from 'randomcolor';

import { CharacterContext } from '../../../context/character';
import { ContractContext } from '../../../context/contract';

import { genRandomName } from '../../../helpers/generators';

import Button from '../../utils/Button';

import { CorgiType } from '../../../types/CorgiTypes';

const InfoPropTypes = {
  color: CorgiType.color,
  backgroundColor: CorgiType.backgroundColor,
};

const Info = ({ color, backgroundColor }) => {
  const { createCorgi } = useContext(ContractContext);
  const { name, quote, setName, setColor, setBackgroundColor } = useContext(CharacterContext);

  const handleName = (event) => {
    setName(event.target.value);
  };

  const generateRandomName = () => {
    setName(genRandomName());
  };

  const handleColor = (event) => {
    setColor(event.target.value);
  };

  const handleBackgroundColor = (event) => {
    setBackgroundColor(event.target.value);
  };

  const generateRandomColor = () => {
    setColor(randomColor());
    setBackgroundColor(randomColor());
  };

  const onSubmit = (event) => {
    event.preventDefault();
    createCorgi(name, color, backgroundColor, quote);
  };

  return (
    <div className='inputboard'>
      <form onSubmit={(event) => onSubmit(event)}>
        <p className='title'>My Corgi is called</p>
        <GiGreekSphinx onClick={() => generateRandomName()} className='icon' />
        <div>
          <input className='inputname' type='text' value={name} onChange={(event) => handleName(event)} required />
        </div>
        <p className='title'>Colors</p>
        <GiBeachBall onClick={() => generateRandomColor()} className='icon' />
        <div>
          <div className='colorpicker'>
            <label>
              <div className='result' style={{ backgroundColor: color }}>
                <input
                  type='color'
                  id='colorPicker'
                  value={color}
                  onChange={(event) => handleColor(event)}
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
                  onChange={(event) => handleBackgroundColor(event)}
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

Info.propTypes = InfoPropTypes;

export default Info;
