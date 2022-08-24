import React, {useContext} from 'react';
import styled from 'styled-components';
import AppContext from '../store/app-context';

import data from '../store/content/misc';

const StyledNotFound = styled.div`
  max-width: 300px;
  margin: 0 auto;
  padding-top: 100px;
  text-align: center;
  flex-wrap: wrap;

  &::before {
    content: '404';
    /* content: '٤٠٤'; */
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 20%;
    left: 35%;
    height: 60vh;
    transform: rotate(-20deg);
    z-index: -1;
    font-size: 20rem;
    color: #888;
    opacity: 0.5;
  }

  & h3 {
    line-height: 1.4;
  }
`;

const NotFound = () => {
  const {lang} = useContext(AppContext);
  const content = data[lang];
  return (
    <StyledNotFound>
      <h3>{content.notFound}</h3>
    </StyledNotFound>
  );
};

export default NotFound;
