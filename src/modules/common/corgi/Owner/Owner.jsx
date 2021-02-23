import React from 'react';

import './Owner.scss';

import { CorgiType } from '~types/CorgiTypes';

const OwnerPropTypes = {
  owner: CorgiType.owner,
};

const Owner = ({ owner }) => <span className='owner'>@{owner}</span>;

Owner.propTypes = OwnerPropTypes;

export default Owner;
