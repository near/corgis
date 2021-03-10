import React from 'react';
import { Link } from 'react-router-dom';

import { CorgiType } from '~types/CorgiTypes';
import { ReactChildrenTypeRequired } from '~types/ReactChildrenType';

const CorgiLinkPropTypes = { id: CorgiType.id.isRequired, children: ReactChildrenTypeRequired };

const CorgiLink = ({ id, children }) => <Link to={`/corgi/${id}`}>{children}</Link>;

CorgiLink.propTypes = CorgiLinkPropTypes;

export default CorgiLink;
