import React from 'react';
import PropTypes from 'prop-types';

import './CorgisShowCase.scss';

import { CorgiCard } from '~modules/common';

import { CorgisArrayType } from '~types/CorgiTypes';

const CorgisShowCasePropTypes = {
  corgis: CorgisArrayType.isRequired,
  title: PropTypes.string,
  showAuctionInfo: PropTypes.bool,
};

const CorgisShowCase = ({ corgis, title, showAuctionInfo = false }) => (
  <div className='showcase'>
    {title && <h3 className='showcase__title'>{title}</h3>}

    {corgis && corgis.length !== 0 && (
      <div className='showcase__grid'>
        {corgis.map((corgi) => (
          <CorgiCard corgi={corgi} key={corgi.id} showAuctionInfo={showAuctionInfo} showActions />
        ))}
      </div>
    )}
  </div>
);

CorgisShowCase.propTypes = CorgisShowCasePropTypes;

export default CorgisShowCase;
