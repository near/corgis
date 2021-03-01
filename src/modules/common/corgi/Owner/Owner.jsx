import React from 'react';

import './Owner.scss';

import { CorgiType } from '~types/CorgiTypes';
import { Link } from 'react-router-dom';

const OwnerPropTypes = {
  owner: CorgiType.owner,
};

const Owner = ({ owner }) => (
  <Link to={`/user/${owner}`}>
    <span className='owner'>@{owner}</span>
  </Link>
);

Owner.propTypes = OwnerPropTypes;

export default Owner;
