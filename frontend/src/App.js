/** TODOs
 * fix lang context
 */

import React, {useContext, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import AppContext from './store/app-context';
import {Auth} from 'aws-amplify';
import Navigation from './Navigation';
import data from './store/content/home';
import Pages from './Routes';

import clickSfx from './assets/sfx/Light-Switch-ON_OFF.mp3';
import './App.css';
import LoadingSpinner from './components/UI/LoadingSpinner';

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

  :not(.rtl) h1,
  :not(.rtl) h2,
  :not(.rtl) h3,
  :not(.rtl) h4,
  :not(.rtl) h5,
  :not(.rtl) h6 {
    font-family: 'PT Serif', serif;
  }

  &.rtl {
    direction: rtl;
    font-family: 'Uthman Taha';
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
      console.log(err);
      // if (err === 'No current user') {
      // }
    }
    setIsAuthenting(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  const content = data[lang];
  document.title = `${content.appName} - ${content.appDesc}`;
  document.documentElement.lang = lang;

  return (
    <StyledApp className={lang === 'ar' && 'rtl'} isAuthing={isAuthenting}>
      {isAuthenting ? (
        <LoadingSpinner lang={lang} />
      ) : (
        <div dir={lang === 'ar' ? 'rtl' : 'auto'} className='container py-3'>
          <Navigation />
          <Pages />
          <audio id='click-sfx' src={clickSfx} preload='none'></audio>
        </div>
      )}
    </StyledApp>
  );
};

export default App;
