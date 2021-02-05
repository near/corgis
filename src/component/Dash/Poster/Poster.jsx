import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../utils/Button';
import Spinner from '../../utils/Spinner';

import corgiFull from '../../../assets/images/corgi-full.png';
import sample from '../../../assets/images/rarity-sample.svg';

const Poster = ({ requestSignIn, isLoading, user }) => {
  let showButton;
  if (isLoading) {
    return <Spinner />;
  }
  if (!user) {
    showButton = <Button description='Login with NEAR' action={requestSignIn} />;
  } else {
    showButton = <div className='show'>Logged In {user.accountId}</div>;
  }
  return (
    <div className='wrapper'>
      <div className='backup'>
        <div className='textPoster'>
          <p className='text1'>Create your own </p>
          <p className='text1'>one-of-the-kind</p>
          <p className='text1'>Corgi today</p>
          <p className='text2'>create, collect, send, or trade</p>
          {showButton}
        </div>
        <div className='imagePoster'>
          <img src={corgiFull} alt='' style={{ width: '100%' }} />
        </div>
      </div>
      <div className='pop'>
        <h2 className='title'>Corgis Display</h2>
        <img src={sample} alt='' />
      </div>
      <style>{`
    .wrapper{
        width: 90%;
        margin:auto;
        max-width: 1100px;
        display: flex;
        flex-direction: column;
      }
      
      .backup {
        background: rgba(251, 176, 64, 0.5);
        border-radius: 10px;
        display: grid;
        grid-template-areas: "text image";
        grid-column-gap: 2%;
        margin: 2% auto;
        padding: 2%;
        justify-items: center;
        align-items: center;
      }
      
      .textPoster {
        grid-area: text;
        margin-top: 1%;
        margin-left: 3%;
        text-align: left;
      }
      
      .text1 {
        font-weight: 600;
        font-size: 2em;
        color: #24272a;
        letter-spacing: 0;
        line-height: 90%;
      }
      
      .text2 {
        font-size: 1em;
        font-weight: 100;
        color: #24272a;
        letter-spacing: 0;
      }
      
      .imagePoster {
        margin-top: -10%;
        grid-area: image;
      }
      
      .pop {
        display: flex;
        justify-content: space-between;
      }
      
      .show {
        border-radius: 5px;
        border: 2px solid #fbb040;
        background-color: #fff;
        padding: 5px 30px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
        text-align: center;
      }
      
      @media all and (max-width: 1000px) {
        .wrapper {
          width: 70%;
        }
      
        .backup {
          display: grid;
          grid-template-areas: "text"
                              "image";
        }
      
        .imagePoster {
          margin-top: 2%;
          grid-area: image;
        }
      }
      
      @media all and (max-width: 540px) {
        .wrapper {
          width: 90%;
        }
      
        .backup {
          display: grid;
          grid-template-areas: "text"
                              "image";
        }
      
        .imagePoster {
          margin-top: 2%;
          grid-area: image;
        }
      }
            
  `}</style>
    </div>
  );
};

Poster.propTypes = {
  requestSignIn: PropTypes.func.isRequired,
  isLoading: PropTypes.boolean.isRequired,
  // TODO: user type
  user: PropTypes.shape({ accountId: PropTypes.string.isRequired }),
};

export default Poster;
