import React from 'react';
import PropTypes from 'prop-types';

import './CorgisShowCase.scss';

import { CorgiCard } from '~modules/common';

import { CorgisArrayType } from '~types/CorgiTypes';

const CorgisShowCasePropTypes = {
  corgis: CorgisArrayType.isRequired,
  showOwner: PropTypes.bool,
  showRarity: PropTypes.bool,
};

const CorgisShowCase = ({ corgis, showOwner = false, showRarity = false }) => (
  <div className='showcase'>
    {corgis.map((corgi) => (
      <CorgiCard corgi={corgi} key={corgi.id} showOwner={showOwner} showRarity={showRarity} />
    ))}
  </div>
);

CorgisShowCase.propTypes = CorgisShowCasePropTypes;

export default CorgisShowCase;
