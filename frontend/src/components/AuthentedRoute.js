import React, {useContext} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import AppContext from '../store/app-context';

const AuthentedRoute = ({children}) => {
  const {pathname, search} = useLocation();
  const {isAuthented} = useContext(AppContext);

  if (!isAuthented) {
    return <Navigate to={`/login?redirect=${pathname}${search}`} />;
  }

  return children;
};

export default AuthentedRoute;
