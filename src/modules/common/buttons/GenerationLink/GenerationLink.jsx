import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './GenerationLink.scss';

import classNames from 'classnames';

import IconNav from '~assets/images/icon-nav.svg';

const GenerationLinkPropTypes = { big: PropTypes.bool };

const GenerationLink = ({ big = false }) => (
  <Link to='/generation'>
    <div className={classNames('generation-link', { 'generation-link--big': big })}>
      <img className='generation-link__icon' src={IconNav} alt='' />
    </div>
  </Link>
);

GenerationLink.propTypes = GenerationLinkPropTypes;

export default GenerationLink;
