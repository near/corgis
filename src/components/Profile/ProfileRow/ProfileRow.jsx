import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './ProfileRow.scss';

import { GiDiscussion, GiJumpingDog, GiDogBowl, GiGlassBall } from 'react-icons/gi';

import Button from '../../utils/Button/Button';
import SwitchCorgiPhoto from '../../utils/corgiPhotos/SwitchCorgiPhoto';

import { CorgiTypeShape } from '../../../types/CorgiTypes';

const ProfileRowPropTypes = {
  corgi: CorgiTypeShape.isRequired,
  deleteCorgi: PropTypes.func.isRequired,
};

const ProfileRow = ({ corgi, deleteCorgi }) => {
  if (!corgi) {
    return <Redirect to='/profile' />;
  }

  const deleteCorgiAction = () => {
    deleteCorgi(corgi.id);
  };

  return (
    <div className='profile-row'>
      <div className='profile-row__corgi'>
        <Link
          to={{
            pathname: `/@${corgi.name}`,
            hash: corgi.id,
          }}
          key={corgi.id}
        >
          <SwitchCorgiPhoto rate={corgi.rate} color={corgi.color} />
        </Link>
      </div>
      <div className='profile-row__description'>
        <GiGlassBall style={{ color: '#9437ff' }} /> {corgi.rate}
        <GiJumpingDog style={{ color: '#9437ff' }} />
        {corgi.name}
        <GiDogBowl style={{ color: '#9437ff' }} />
        from: {corgi.sender.length > 0 ? corgi.sender : 'NEAR'}
        <p>
          <GiDiscussion style={{ color: '#9437ff' }} />
          {corgi.message ? corgi.message : 'This lovely corgi is for you'}
        </p>
        <Button description='^ delete' action={deleteCorgiAction} />
      </div>
    </div>
  );
};

ProfileRow.propTypes = ProfileRowPropTypes;

export default ProfileRow;
