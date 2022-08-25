import React, {useContext} from 'react';
import styled, {css} from 'styled-components';
import AppContext from '../store/app-context';

import data from '../store/content/misc';

const StyledNotFound = styled.div`
  width: 250px;
  max-width: 300px;
  margin: 7rem auto;
  padding: 0.5em;
  text-align: center;
  justify-content: center;
  flex-wrap: wrap;

  ${({lang}) =>
    lang === 'ar'
      ? css`
          &::before {
            content: '٤٠٤';
            font-size: 25rem;
            top: 4rem;
          }
        `
      : css`
          &::before {
            content: '404';
            font-size: 20rem;
            top: 5rem;
          }
        `};

  &::before {
    width: 380px;
    margin: 0.5em auto;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 35%;
    height: 30vh;
    z-index: -1;
    color: #888;
    opacity: 0.3;
  }

  & h3 {
    line-height: 1.5;
    font-size: 1.8rem;
  }
`;

const NotFound = () => {
  const {lang} = useContext(AppContext);
  const uiText = data[lang];
  return (
    <StyledNotFound lang={lang}>
      <h3>{uiText.notFound}</h3>
    </StyledNotFound>
  );
};

export default NotFound;
