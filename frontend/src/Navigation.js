import {Fragment, useContext} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from 'react-router-bootstrap';
import {Auth} from 'aws-amplify';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import AppContext from './store/app-context';
import data from './store/content/header';
import Translator from './components/Translator';

const StyledNavigation = styled.header`
  .logo {
    margin-inline-start: 0.5em;
  }

  .navbtns {
    margin-inline-start: 0.5em;
  }

  .navbtns > * {
    max-width: fit-content;
    margin-block: 0.5em;
    padding-inline: 0.8em;
  }

  .rtl & .logo {
    font-size: 1.5rem;
    font-weight: 700;
  }

  & .link {
    padding: 0.2em;
  }

  .rtl & .link {
    font-size: 1.3rem;
    font-family: Lotus;
  }

  .nav {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }
`;

const Navigation = () => {
  const nav = useNavigate();
  const {
    lang,
    isAuthented,
    setIsAuthented,
    onChangeLang,
    currentUser,
    setCurrentUser,
  } = useContext(AppContext);
  const uiText = data[lang];

  const handleTranslator = evt => {
    const newLang = evt.target.dataset.lang;
    if (!newLang || lang === newLang) return;
    onChangeLang(newLang);
  };

  const logout = async () => {
    try {
      await Auth.signOut();
      setTimeout(() => {
        setIsAuthented('LOGOUT');
        const email = currentUser?.email;
        setCurrentUser({});
        nav('/login', {state: {email}});
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StyledNavigation>
      <Navbar collapseOnSelect bg='light' expand='md' className='mb-3'>
        <LinkContainer to='/'>
          <Navbar.Brand className='font-weight-bold text-muted logo'>
            {uiText.logo}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className='navbtns justify-content-end'>
          <Translator lang={lang} changeLang={handleTranslator} />
          <Nav className='nav' activeKey={window.location.pathname}>
            {isAuthented ? (
              <Fragment>
                <LinkContainer className='link' to='/settings'>
                  <Nav.Link>{uiText.settings}</Nav.Link>
                </LinkContainer>
                <LinkContainer className='link' to='/login'>
                  <Nav.Link onClick={logout}>{uiText.logout}</Nav.Link>
                </LinkContainer>
              </Fragment>
            ) : (
              <Fragment>
                <LinkContainer className='link' to='/signup'>
                  <Nav.Link>{uiText.signup}</Nav.Link>
                </LinkContainer>
                <LinkContainer className='link' to='/login'>
                  <Nav.Link>{uiText.login}</Nav.Link>
                </LinkContainer>
              </Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </StyledNavigation>
  );
};

export default Navigation;
