import React from 'react';
import PropTypes from 'prop-types';

import './CorgisShowCase.scss';

import { CorgiCard } from '~modules/common';

import { CorgisArrayType } from '~types/CorgiTypes';

const CorgisShowCasePropTypes = {
  corgis: CorgisArrayType.isRequired,
  title: PropTypes.string,
  showActions: PropTypes.bool,
};

const CorgisShowCase = ({ corgis, title, showActions = false }) => (
  <div className='showcase'>
    {title && <h3 className='showcase__title'>{title}</h3>}
    <div className='showcase__grid'>
      {corgis.map((corgi) => (
        <CorgiCard corgi={corgi} key={corgi.id} showActions={showActions} />
      ))}
    </div>
  </div>
);

CorgisShowCase.propTypes = CorgisShowCasePropTypes;

export default CorgisShowCase;
