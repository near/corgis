import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { NearContext } from '../../context/NearContext';
import { ContractContext } from '../../context/contract';

import ProfileRow from './ProfileRow/ProfileRow';

import Spinner from '../utils/Spinner';
import { CorgiTwo } from '../utils/corgiAnimation';

const Profile = () => {
  const nearContext = useContext(NearContext);
  const contractContext = useContext(ContractContext);

  const { corgis, loading, deleteCorgi, deleting, error } = contractContext;

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

  if (deleting) {
    return (
      <div className='box'>
        <CorgiTwo color={'black'} />
        <style>{`
      .box {
        animation-name: spin;
        animation-duration: 5000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
      }
      @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
      }
    `}</style>
      </div>
    );
  }
  return (
    <div>
      <h1>Your Corgis</h1>
      <p>look and delete</p>
      <div>
        {corgis.map((corgi) => (
          <ProfileRow deleteCorgi={deleteCorgi} corgi={corgi} key={corgi.id} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
