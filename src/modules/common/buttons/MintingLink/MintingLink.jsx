import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './MintingLink.scss';

import classNames from 'classnames';

import IconNav from '~assets/images/icon-nav.svg';

const MintingLinkPropTypes = { big: PropTypes.bool };

const MintingLink = ({ big = false }) => (
  <Link to='/minting'>
    <div className={classNames('minting-link', { 'minting-link--big': big })}>
      <img className='minting-link__icon' src={IconNav} alt='' />
    </div>
  </Link>
);

MintingLink.propTypes = MintingLinkPropTypes;

export default MintingLink;
