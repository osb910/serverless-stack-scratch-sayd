import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {API} from 'aws-amplify';
import ListGroup from 'react-bootstrap/ListGroup';
import {LinkContainer} from 'react-router-bootstrap';
import {BsPencilSquare} from 'react-icons/bs';
import AppContext from '../store/app-context';
import data from '../store/content/home';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const StyledHome = styled.main`
  & .lander {
    padding: 80px 0;
    text-align: center;
  }

  :not(.rtl) & .lander h1 {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
  }

  .rtl & :not(h1) :not(h2) {
    font-family: Lotus;
  }
  .rtl & p {
    font-size: 1.2rem;
  }

  .rtl .pencil-icon {
    display: inline-block;
    border: 1px solid red;
    transform: scaleX(-1);
  }
`;

const Home = () => {
  const {lang, isAuthented} = useContext(AppContext);
  const uiText = data[lang];
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = () => API.get('notes', '/notes');

  useEffect(() => {
    const onLoad = async () => {
      if (!isAuthented) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (err) {
        console.log(err);
      }

      setIsLoading(false);
    };

    onLoad();
  }, [isAuthented]);

  const notesDisplay = notes.map(({noteId, content, createdAt}) => (
    <LinkContainer key={noteId} to={`/notes/${noteId}`}>
      <ListGroup.Item action dir='auto'>
        <span className='font-weight-bold'>
          {content.trim().split('\n')[0]}
        </span>
        <br />
        <span className='text-muted'>
          {uiText.created}
          {new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : lang, {
            timeStyle: 'short',
            dateStyle: 'short',
          }).format(new Date(createdAt))}
        </span>
      </ListGroup.Item>
    </LinkContainer>
  ));

  const renderNotesList = notes => {
    return (
      <>
        <LinkContainer to='/notes/new'>
          <ListGroup.Item action className='py-3 text-nowrap text-truncate'>
            <BsPencilSquare className='pencil-icon' size={17} />{' '}
            <span className='ml-2 font-weight-bold'>{uiText.createNote}</span>
          </ListGroup.Item>
        </LinkContainer>
        {notesDisplay}
      </>
    );
  };

  const lander = (
    <section className='lander'>
      <h1>{uiText.appName}</h1>
      <p className='text-muted'>{uiText.appDesc}</p>
    </section>
  );

  const notesList = (
    <section className='notes'>
      <h2 className='pb-3 mt-4 mb-3 border-bottom'>{uiText.yourNotes}</h2>
      {isLoading && <LoadingSpinner lang={lang} />}
      <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
    </section>
  );
  return <StyledHome>{isAuthented ? notesList : lander}</StyledHome>;
};

export default Home;
