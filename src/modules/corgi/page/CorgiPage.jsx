import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import './CorgiPage.scss';

import { ContractContext, NearContext, TransferContextProvider } from '~contexts';

import { CorgiCard, CorgiRate, Spinner } from '~modules/common';
import { SendModal, ShareActions, ShareModal } from '~modules/corgi/components';

const CorgiPage = () => {
  const { user } = useContext(NearContext);
  const { corgi, loading, getCorgi, transfering } = useContext(ContractContext);

  const [showSend, setSend] = useState(false);
  const [showShare, setShare] = useState(false);

  const { params } = useRouteMatch();
  const { id } = params;

  useEffect(() => {
    if (id) {
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
