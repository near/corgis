import React, { useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import './UserPage.scss';

import { ContractContext, NearContext } from '~contexts';

import { CorgisShowCase, CorgiSpinner } from '~modules/common';
import checkAccountLegit from '~helpers/checkAccountLegit';
import { USER_VALIDATION_MESSAGES } from '~constants/validation/account';
import { usePrevious } from '~hooks/';

const UserPage = () => {
  const { user, nearContent } = useContext(NearContext);
  const { corgis, loading, getCorgis } = useContext(ContractContext);

  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [accountCorgis, setAccountCorgis] = useState(null);

  const [isAccountExist, setIsAccountExist] = useState(true);

  const { params: { id } } = useRouteMatch();

  const prevId = usePrevious(id);

  const setCorgis = (newCorgis) => {
    setAccountCorgis(newCorgis);
    setIsAccountExist(true);
  };

  const fetchUser = async () => {
    setIsAccountLoading(true);

    if (user && id === user.accountId) {
      setCorgis(corgis);
    } else if (await checkAccountLegit(id, nearContent.connection)) {
      setCorgis(await getCorgis(id));
    } else {
      setIsAccountExist(false);
    }

    setIsAccountLoading(false);
  };

  useEffect(() => {
    if (id !== prevId || isAccountLoading) {
      setCorgis(null);
    }
  }, [id, prevId, isAccountLoading]);

  useEffect(() => {
    if (user && id === user.accountId) {
      setCorgis(corgis);
    }
  }, [user, id, corgis]);

  useEffect(() => {
    let mounted = true;

    if (!loading && !isAccountLoading && id && mounted && !accountCorgis && isAccountExist) {
      fetchUser();
    }

    return () => {
      mounted = false;
    };
  }, [loading, user, id, nearContent, isAccountLoading, accountCorgis]);

  return (
    <div className='user'>
      {isAccountExist ? (
        <>
          {!isAccountLoading ? (
            <>
              <h1 className='user__title'>{`${id} Corgis:`}</h1>

              <div className='user__corgis'>
                {accountCorgis && accountCorgis.length ? (
                  <CorgisShowCase corgis={accountCorgis} />
                ) : (
                  <h3 className='user__error'>This user has no Сorgi.</h3>
                )}
              </div>
            </>
          ) : (
            <CorgiSpinner />
          )}
        </>
      ) : (
        <h1 className='user__error'>{USER_VALIDATION_MESSAGES.NOT_EXIST}</h1>
      )}
    </div>
  );
};

export default UserPage;
