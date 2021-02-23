import React from 'react';

import './Activity.scss';

import humanizeTime from '~helpers/humanizeTime';

import { CorgiType } from '~types/CorgiTypes';
import { Owner } from '~modules/common';

const ActivityPropTypes = {
  created: CorgiType.created,
  modified: CorgiType.modified,
  owner: CorgiType.owner,
  sender: CorgiType.sender,
};

const Activity = ({ created, modified, owner, sender }) => (
  <p className='activity'>
    {created === modified ? (
      <>
        Minted {humanizeTime(created)} by <Owner owner={owner} />
      </>
    ) : (
      <>
        Gifted {humanizeTime(modified)} to <Owner owner={owner} /> by <Owner owner={sender} />
      </>
    )}
  </p>
);

Activity.propTypes = ActivityPropTypes;

export default Activity;
