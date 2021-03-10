import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ReactChildrenType } from '~types/ReactChildrenType';

const GuardedRoutePropTypes = {
  children: ReactChildrenType,
  auth: PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.instanceOf(null)]),
  isLoading: PropTypes.bool,
  rest: (props, propName, componentName) => {},
};

const GuardedRoute = ({ children, auth, isLoading = false, ...rest }) => {
  if (isLoading) {
    return null;
  }

  return <Route {...rest}>{auth === true ? children : <Redirect to='/' />}</Route>;
};

GuardedRoute.propTypes = GuardedRoutePropTypes;

export default GuardedRoute;
