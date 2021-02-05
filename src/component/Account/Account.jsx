import React, { useContext, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';

import Spinner from '../utils/Spinner';
import AccountCard from './AccountCard/AccountCard';

const Account = () => {
  const nearContext = useContext(NearContext);
  const useContract = useContext(ContractContext);
  const { created, loading, clearCreatedCorgiState, getCorgisList } = useContract;
  const { corgis } = useContract;

  useEffect(() => {
    if (nearContext.user) {
      getCorgisList(nearContext.user.accountId);
    }
  }, [getCorgisList, nearContext]);

  if (created) {
    clearCreatedCorgiState();
  }

  if (!nearContext.user) {
    return <Redirect to='/' />;
  }
  if (corgis && corgis.length === 0) {
    return <Redirect to='/generation' />;
  }
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
