import React from 'react';
import {Route, Routes} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewNote from './containers/NewNote';
import Notes from './containers/Notes';
import NotFound from './containers/NotFound';
import Settings from './containers/Settings';
import AuthentedRoute from './components/AuthentedRoute';
import UnauthentedRoute from './components/UnauthentedRoute';

const appear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
    transform: scale(0.95);
  }
  10% {
    opacity: 0.2;
  }
  30% {
    transform: scale(0.98);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    transform: scale(1);
  }
`;

const StyledPages = styled.main`
  & > * {
    animation: ${appear} 500ms ease-in;
  }
`;

const Pages = () => {
  return (
    <StyledPages>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/login'
          element={
            <UnauthentedRoute>
              <Login />
            </UnauthentedRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <UnauthentedRoute>
              <Signup />
            </UnauthentedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <AuthentedRoute>
              <Settings />
            </AuthentedRoute>
          }
        />
        <Route
          path='/notes/new'
          element={
            <AuthentedRoute>
              <NewNote />
            </AuthentedRoute>
          }
        />
        <Route
          path='/notes/:id'
          element={
            <AuthentedRoute>
              <Notes />
            </AuthentedRoute>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </StyledPages>
  );
};

export default Pages;
