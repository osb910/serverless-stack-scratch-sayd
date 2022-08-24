import Button from 'react-bootstrap/Button';
import {BsArrowRepeat} from 'react-icons/bs';
import styled, {keyframes, css} from 'styled-components';

const spin = keyframes`
    from {
      transform: scale(1) rotate(0deg);
    }
    to {
      transform: scale(1) rotate(360deg);
    }
`;

const StyledLoaderBtn = styled.div`
  margin-top: 10px;

  & .spinning {
    margin-inline: 7px;
    top: 2px;
    animation: ${spin} 1s infinite linear;
    ${props =>
      props.lang === 'ar' &&
      css`
        transform: rotateY(180deg);
        animation-direction: reverse;
      `}
  }
`;

const LoaderButton = ({
  isLoading,
  className = '',
  disabled = false,
  lang,
  ...props
}) => {
  return (
    <StyledLoaderBtn lang={lang}>
      <Button
        disabled={disabled || isLoading}
        className={` ${className}`}
        {...props}
      >
        {isLoading && <BsArrowRepeat className='spinning' />}
        {props.children}
      </Button>
    </StyledLoaderBtn>
  );
};

export default LoaderButton;
