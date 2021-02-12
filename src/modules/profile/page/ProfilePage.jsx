import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import './ProfilePage.scss';

import { ContractContext } from '~context/contract';

import { CorgiAnimTwo, Spinner } from '~modules/common';
import { ProfileRow } from '~modules/profile/components/';

const ProfilePage = () => {
  const { corgis, loading, deleteCorgi, deleting, error } = useContext(ContractContext);

  if (error) {
    console.error(error);
  }

  if (!corgis || loading) {
    return <Spinner />;
  }

  if (corgis && corgis.length === 0) {
    return <Redirect to='/generation' />;
  }

  return (
    <div className='profile'>
      {!deleting ? (
        <>
          <h1 className='profile__title'>Your Corgis</h1>
          <p className='profile__description'>look and delete</p>
          <div className='profile__corgis'>
            {corgis.map((corgi) => (
              <ProfileRow deleteCorgi={deleteCorgi} corgi={corgi} key={corgi.id} />
            ))}
          </div>
        </>
      ) : (
        <div className='profile__deletion'>
          <CorgiAnimTwo color={'black'} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
