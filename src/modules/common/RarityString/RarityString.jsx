import React from 'react';

import './RarityString.scss';

import classNames from 'classnames';

import { CorgiType } from '~types/CorgiTypes';

const RarityStringPropTypes = { rate: CorgiType.rate.isRequired };

const RarityString = ({ rate }) => {
  const rateString = rate.indexOf('_') !== -1 ? rate.split('_').join(' ') : rate;

  return <span className={classNames('rarity', `rarity--${rate.toLowerCase()}`)}>{rateString}</span>;
};

RarityString.propTypes = RarityStringPropTypes;

export default RarityString;
