import React, { useContext, useEffect } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import './CorgiPage.scss';

import { ContractContext, NearContext } from '~contexts';

import { CorgiActions, CorgiCard, CorgiRate, CorgiSpinner } from '~modules/common';

const CorgiPage = () => {
  const { user } = useContext(NearContext);
  const { corgi, loading, getCorgi, deleted, transfered } = useContext(ContractContext);

  const {
    params: { id },
  } = useRouteMatch();

  useEffect(() => {
    if (id) {
      getCorgi(id);
    }
  }, [id, transfered]);

  if (deleted || !id) {
    return <Redirect to={user ? `/user/${user.accountId}` : '/'} />;
  }

  if (!corgi || loading) {
    return <CorgiSpinner />;
  }

  return (
    <div className='corgi-page'>
      <div className='corgi-page__card'>
        <CorgiCard corgi={corgi} big hideActions />
      </div>

      <div className='corgi-page__content'>
        <CorgiRate rate={corgi.rate} />

        <div className='corgi-page__actions'>
          <CorgiActions corgi={corgi} />
        </div>
      </div>
    </div>
  );
};

export default CorgiPage;
