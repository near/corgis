import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';

import { BigCard } from '../CorgiCard/Card';
import Send from './Send/Send';
import Share from './Share/Share';

import Spinner from '../utils/Spinner';
import Rate from '../utils/Rate';

import iconSend from '../../assets/images/icon-send.svg';
import iconShare from '../../assets/images/icon-share.svg';
import { TransferContextProvider } from '../../context/transfer';

const SinglePage = () => {
  const nearContext = useContext(NearContext);
  const useContract = useContext(ContractContext);
  const { corgi, loading, getCorgi, transfering } = useContract;
  const id = window.location.hash.slice(1);

  useEffect(() => {
    if (id) {
      getCorgi(id);
    }
  }, [getCorgi, id]);

  const [showSend, setSend] = useState(false);
  const [showShare, setShare] = useState(false);
  const openSendModal = () => {
    setSend(true);
  };
  const openShareModal = () => {
    setShare(true);
  };
  const closeModal = () => {
    setSend(false);
    setShare(false);
  };

  if (corgi && corgi.owner !== nearContext.user.accountId) {
    return <Redirect to='/account' />;
  }

  if (!nearContext.user) {
    return <Redirect to='/' />;
  }
  if (!corgi || loading) {
    return <Spinner />;
  }
  if (!id) {
    return <Redirect to='/account' />;
  }

  return (
    <div>
      <TransferContextProvider>
        <Send corgi={corgi} transfering={transfering} show={showSend} closeModal={closeModal} />
        <Share corgi={corgi} closeModal={closeModal} show={showShare} />
        <div>
          <h1>Meet {corgi.name}!</h1>
          <div>
            <BigCard
              backgroundColor={corgi.backgroundColor}
              color={corgi.color}
              sausage={corgi.sausage}
              quote={corgi.quote}
            />
          </div>
          <div className='wrapperS'>
            <Rate rate={corgi.rate} />
            <SendAndShare openSendModal={openSendModal} openShareModal={openShareModal} />
          </div>
        </div>
      </TransferContextProvider>
      <style>{`
        .wrapperS {
          width: 70%;
          max-width: 800px;
          margin: 2% auto;
          display: flex;
          justify-content: space-between;
      }
      
      .card {
          background-color: azure;
          margin: 3%;
          padding: 2%;
          display: flex;
          border-radius: 5px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          cursor: pointer;
      }
      
      .cardChar {
          color: #2b73c7;
      }
      
      .text {
          margin-left: 10px;
          display: inline-block;
          width: 200px;
          text-align: left;
          padding: 0;
      }
      
      .small {
          display: none;
      }
      
      @media all and (max-width: 416px) {
          .text {
              display: none;
          }
      
          .small {
              font-size: 1rem;
              display: inline;
              color: #2b73c7;
          }

          .card {
            width: 100px;
          }

          .icontext {
            display: none;
          }
      }
      `}</style>
    </div>
  );
};

const SendAndSharePropTypes = {
  openShareModal: PropTypes.func.isRequired,
  openSendModal: PropTypes.func.isRequired,
};

const SendAndShare = ({ openShareModal, openSendModal }) => {
  const style = { display: 'flex', flexDirection: 'column', width: '300px' };
  return (
    <div>
      <h5 className='icontext'>What would you like to do with </h5>
      <span style={style}>
        <SendCard clicked={openSendModal} />
        <ShareCard clicked={openShareModal} />
      </span>
    </div>
  );
};
SendAndShare.propTypes = SendAndSharePropTypes;

const SendCardPropTypes = { clicked: PropTypes.func.isRequired };

const SendCard = ({ clicked }) => (
  <button className='card' onClick={clicked}>
    <img src={iconSend} alt='Send' style={{ height: '60%', paddingTop: '20px' }} />
    <div className='small'>Send</div>
    <div className='text'>
      <h3 className='cardChar'>Send as a gift</h3>
      <p>The perfect gift for any occasion</p>
    </div>
  </button>
);
SendCard.propTypes = SendCardPropTypes;

const ShareCardPropTypes = { clicked: PropTypes.func.isRequired };

const ShareCard = ({ clicked }) => (
  <button className='card' onClick={clicked}>
    <img src={iconShare} alt='Share' style={{ height: '60%', paddingTop: '20px' }} />
    <div className='small'>Share</div>
    <div className='text'>
      <h3 className='cardChar'>Share on Social</h3>
      <p>Got something rare? It is time to brag a bit.</p>
    </div>
  </button>
);
ShareCard.propTypes = ShareCardPropTypes;

export default SinglePage;
