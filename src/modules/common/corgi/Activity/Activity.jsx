import React from 'react';

import './Activity.scss';

import { humanizeTime } from '~helpers/time';

import { Owner } from '~modules/common';

import { CorgiType } from '~types/CorgiTypes';

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
        Minted {humanizeTime(created)} ago by <Owner name={owner} />
      </>
    ) : (
      <>
        Gifted {humanizeTime(modified)} ago to <Owner name={owner} /> by <Owner name={sender} />
      </>
    )}
  </p>
);

Activity.propTypes = ActivityPropTypes;

export default Activity;
