import { Link } from 'react-router-dom';
import React from 'react';

import DashCard from './DashCard/DashCard';

import { CorgisArrayType } from '../../../types/CorgiTypes';

const ShowCasePropTypes = { displayCorgis: CorgisArrayType.isRequired };

const ShowCase = ({ displayCorgis }) => {
  return (
    <div>
      {displayCorgis.map((corgi) => (
        <Link
          to={{
            pathname: '/share',
            hash: corgi.id,
          }}
          key={corgi.id}
        >
          <DashCard corgi={corgi} />
        </Link>
      ))}
    </div>
  );
};

ShowCase.propTypes = ShowCasePropTypes;

export default ShowCase;
