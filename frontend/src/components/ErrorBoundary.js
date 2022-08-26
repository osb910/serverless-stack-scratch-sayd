import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import AppContext from '../store/app-context';
import {logError} from '../store/errorLib';
import data from '../store/content/misc';

const StyledErrBoundary = styled.div`
  padding-top: 100px;
  .rtl & h3 {
    font-family: 'Uthman Taha';
  }
`;

const ErrBoundary = () => {
  const {lang} = useContext(AppContext);
  const uiText = data[lang];
  return (
    <StyledErrBoundary className='text-center'>
      <h3>{uiText.problemLoading}</h3>
    </StyledErrBoundary>
  );
};

export default class ErrorBoundary extends React.Component {
  state = {hasError: false};

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    return this.state.hasError ? <ErrBoundary /> : this.props.children;
  }
}
