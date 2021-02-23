import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import './AccountPage.scss';

import { ContractContext } from '~contexts';

import { CorgisShowCase, Spinner } from '~modules/common';

const AccountPage = () => {
  const { corgis, created, loading, clearCreatedCorgi } = useContext(ContractContext);

  useEffect(() => {
    if (created) {
      clearCreatedCorgi();
    }
  }, [created, clearCreatedCorgi]);

  if (corgis && corgis.length === 0) {
    return <Redirect to='/generation' />;
  }

  return (
    <div className='account'>
      <div className='account__header'>
        <h1 className='account__title'>Your Pack</h1>
        <p className='account__description'>Create, collect, send or trade</p>
      </div>

      <div className='account__corgis'>{!loading ? <CorgisShowCase corgis={corgis} showActions /> : <Spinner />}</div>
    </div>
  );
};

export default AccountPage;
