import React, { useContext, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { ContractContext } from '~context/contract';

import { CorgiTile, Spinner } from '~modules/common';

const AccountPage = () => {
  const { corgis, created, loading, clearCreatedCorgiState } = useContext(ContractContext);

  useEffect(() => {
    if (created) {
      clearCreatedCorgiState();
    }
  }, [created, clearCreatedCorgiState]);

  if (corgis && corgis.length === 0) {
    return <Redirect to='/generation' />;
  }

  return (
    <div className='account'>
      <div className='account__header'>
        <h1 className='account__title'>Your Pack</h1>
        <p className='account__description'>Create,collect,send or trade</p>
      </div>
      <div className='account__corgis'>
        {!loading && corgis && corgis.length > 0 ? (
          corgis.map((corgi) => (
            <Link
              to={{
                pathname: `/@${corgi.name}`,
                hash: corgi.id,
              }}
              key={corgi.id}
            >
              <CorgiTile corgi={corgi} />
            </Link>
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default AccountPage;
