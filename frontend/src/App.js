/** TODOs
 *
 */

import React, {useContext, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import AppContext from './store/app-context';
import {Auth} from 'aws-amplify';
import Navigation from './Navigation';
import data from './store/content/home';
import Pages from './Routes';
import {onError} from './store/errorLib';

import clickSfx from './assets/sfx/Light-Switch-ON_OFF.mp3';
import './App.css';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

const StyledApp = styled.div`
  box-sizing: border-box;
  margin: auto;
  display: flex;
  flex-direction: column;
  ${({isAuthing}) =>
    isAuthing &&
    css`
      justify-content: center;
      align-items: center;
    `}
  height: 100vh;
  text-align: center;
  transition: all 400ms ease;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    ${({lang}) =>
      lang === 'ar'
        ? css`
            font-family: 'Uthman Taha';
          `
        : css`
            font-family: 'PT Serif', serif;
          `};
  }

  &.rtl {
    direction: rtl;
    font-family: 'Lotus';
    font-size: 1.15rem;
  }

  /* input[type='text'], */
  input[type='email'],
  input[type='email']:focus-within {
    font-family: 'Open Sans', sans-serif;
  }
`;

const App = () => {
  const [isAuthenting, setIsAuthenting] = useState(true);
  const {lang, setIsAuthented} = useContext(AppContext);

  const onLoad = async () => {
    try {
      const res = await Auth.currentSession();
      console.log(res);
      setIsAuthented('LOGIN');
    } catch (err) {
      if (err === 'No current user') {
        console.log(err);
      } else {
        onError(err);
      }
    }
    setIsAuthenting(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  const uiText = data[lang];
  document.title = `${uiText.appName} - ${uiText.appDesc}`;
  document.documentElement.lang = lang;

  return (
    <StyledApp className={lang === 'ar' && 'rtl'} isAuthing={isAuthenting}>
      {isAuthenting ? (
        <LoadingSpinner lang={lang} />
      ) : (
        <div dir={lang === 'ar' ? 'rtl' : 'auto'} className='container py-3'>
          <Navigation />
          <ErrorBoundary>
            <Pages />
          </ErrorBoundary>
          <audio id='click-sfx' src={clickSfx} preload='none'></audio>
        </div>
      )}
    </StyledApp>
  );
};

export default App;
