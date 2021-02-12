import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import './Profile.scss';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';

import ProfileRow from './ProfileRow/ProfileRow';

import Spinner from '../utils/Spinner/Spinner';
import { CorgiTwo } from '../utils/corgiAnimation';

const Profile = () => {
  const nearContext = useContext(NearContext);
  const { corgis, loading, deleteCorgi, deleting, error } = useContext(ContractContext);

  if (!nearContext.user) {
    return <Redirect to='/' />;
  }

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
          <CorgiTwo color={'black'} />
        </div>
      )}
    </div>
  );
};

export default Profile;
