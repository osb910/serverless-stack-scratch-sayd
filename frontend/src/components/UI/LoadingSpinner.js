import styled, {keyframes, css} from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledLoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 54px;
  height: 54px;

  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 40px;
    height: 40px;
    margin: 6px;
    border: 4px solid #1d3557;
    border-radius: 50%;
    animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    ${props =>
      props.lang === 'ar' &&
      css`
        animation-direction: reverse;
      `}
    border-color: #1d3557 transparent transparent transparent;
  }

  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

const LoadingSpinner = ({lang}) => (
  <StyledLoadingSpinner lang={lang}>
    <div />
    <div />
    <div />
    <div />
  </StyledLoadingSpinner>
);

export default LoadingSpinner;
