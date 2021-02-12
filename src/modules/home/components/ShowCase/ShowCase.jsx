import React from 'react';
import { Link } from 'react-router-dom';

import './ShowCase.scss';

import { CorgiTile } from '~modules/common';

import { CorgisArrayType } from '~types/CorgiTypes';

const ShowCasePropTypes = { corgis: CorgisArrayType.isRequired };

const ShowCase = ({ corgis }) => (
  <div className='showcase'>
    {corgis.map((corgi) => (
      <Link
        to={{
          pathname: '/share',
          hash: corgi.id,
        }}
        key={corgi.id}
      >
        <CorgiTile corgi={corgi}>
          Created by <span style={{ color: 'orange' }}>@{corgi.owner}</span>
        </CorgiTile>
      </Link>
    ))}
  </div>
);

ShowCase.propTypes = ShowCasePropTypes;

export default ShowCase;
