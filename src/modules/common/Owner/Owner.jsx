import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Owner.scss';

import classNames from 'classnames';

import { CorgiType } from '~types/CorgiTypes';

const OwnerPropTypes = { name: CorgiType.owner, highlight: PropTypes.bool };

const Owner = ({ name, highlight = false }) => (
  <Link to={`/user/${name}`} className='owner' style={{ maxWidth: '100%' }}>
    <span className={classNames('owner__name', { 'owner__name--highlight': highlight })}>@{name}</span>
  </Link>
);

Owner.propTypes = OwnerPropTypes;

export default Owner;
