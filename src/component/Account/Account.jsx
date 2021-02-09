import React, { useContext, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';

import Spinner from '../utils/Spinner';
import AccountCard from './AccountCard/AccountCard';

const Account = () => {
  const { user } = useContext(NearContext);
  const { corgis, created, loading, clearCreatedCorgiState, getCorgisList } = useContext(ContractContext);

  if (created) {
    clearCreatedCorgiState();
  }

  if (!user) {
    return <Redirect to='/' />;
  }

  if (corgis && corgis.length === 0) {
    return <Redirect to='/generation' />;
  }

  useEffect(() => {
    getCorgisList(user.accountId);
  }, [getCorgisList]);

  return (
    <div>
      <div>
        <h1 className='head'>Your Pack</h1>
        <p>Create,collect,send or trade</p>
      </div>
      <div>
        {!loading && corgis && corgis.length > 0 ? (
          corgis.map((corgi) => (
            <Link
              to={{
                pathname: `/@${corgi.name}`,
                hash: corgi.id,
              }}
              key={corgi.id}
            >
              <AccountCard corgi={corgi} />
            </Link>
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default Account;
