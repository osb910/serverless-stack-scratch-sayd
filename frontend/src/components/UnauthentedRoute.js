import React, {cloneElement, useContext} from 'react';
import {Navigate} from 'react-router-dom';
import AppContext from '../store/app-context';

const querystring = (name, url = window.location.href) => {
  const parsedName = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results || !results[2]) {
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const UnauthentedRoute = props => {
  const {isAuthented} = useContext(AppContext);
  const {children} = props;
  const redirect = querystring('redirect');

  if (isAuthented) {
    return <Navigate to={redirect || '/'} />;
  }

  return cloneElement(children, props);
};

export default UnauthentedRoute;
