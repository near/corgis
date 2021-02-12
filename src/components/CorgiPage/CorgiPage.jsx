import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import './CorgiPage.scss';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';
import { TransferContextProvider } from '../../context/transfer';

import CorgiCard from '../CorgiCard/CorgiCard';
import SendModal from './SendModal/SendModal';
import ShareModal from './ShareModal/ShareModal';

import Spinner from '../utils/Spinner/Spinner';
import CorgiRate from '../utils/corgiPhotos/CorgiRate';
import ShareActions from './ShareActions/ShareActions';

const CorgiPage = () => {
  const { user } = useContext(NearContext);
  const { corgi, loading, getCorgi, transfering } = useContext(ContractContext);

  const [showSend, setSend] = useState(false);
  const [showShare, setShare] = useState(false);

  const { hash } = useLocation();
  const id = !!hash.length ? hash.slice(1) : hash;

  useEffect(() => {
    if (!!id) {
      getCorgi(id);
    }
  }, [getCorgi, id]);

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

  if (!user) {
    return <Redirect to='/' />;
  }

  if (!id) {
    return <Redirect to='/account' />;
  }

  if (!corgi || loading) {
    return <Spinner />;
  }

  if (corgi.owner !== user.accountId) {
    return <Redirect to='/account' />;
  }

  return (
    <div className='corgi-page'>
      <TransferContextProvider>
        <SendModal corgi={corgi} transfering={transfering} show={showSend} closeModal={closeModal} />
        <ShareModal corgi={corgi} closeModal={closeModal} show={showShare} />

        <h1 className='corgi-page__title'>Meet {corgi.name}!</h1>

        <div className='corgi-page__card'>
          <CorgiCard corgi={corgi} size='big' />
        </div>

        <div className='corgi-page__content'>
          <CorgiRate rate={corgi.rate} />

          <div className='corgi-page__actions'>
            <ShareActions openSendModal={openSendModal} openShareModal={openShareModal} />
          </div>
        </div>
      </TransferContextProvider>
    </div>
  );
};

export default CorgiPage;
