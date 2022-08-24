import React, {useRef, useState, useContext} from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import {useNavigate} from 'react-router-dom';
import {API} from 'aws-amplify';

import AppContext from '../store/app-context';
import {s3Upload} from '../store/awsLib';
import data from '../store/content/notes';
import LoaderButton from '../components/UI/LoaderButton';
// import {onError} from '../store/errorLib';
import config from '../config';

const StyledNewNote = styled.section`
  height: 300px;
  font-size: 1.5rem;

  & .field {
    font-size: 1.2rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }
`;

const NewNote = () => {
  const {lang} = useContext(AppContext);
  const uiText = data[lang];
  const file = useRef(null);
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return !/^\s*$/.test(content);
  };

  const changeFile = evt => {
    file.current = evt.target.files[0];
  };

  const createNote = note =>
    API.post('notes', '/notes', {
      body: note,
    });

  const submit = async evt => {
    evt.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(uiText.largeFileSize);
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        const attachment = await s3Upload(file.current);
        await createNote({name: '', content, attachment});
      }
      setTimeout(() => {
        nav('/');
      }, 1000);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <StyledNewNote>
      <Form onSubmit={submit}>
        <Form.Group controlId='content'>
          <Form.Control
            dir='auto'
            value={content}
            as='textarea'
            onChange={evt => setContent(evt.target.value)}
            className='field'
          />
        </Form.Group>
        <Form.Group controlId='file'>
          <Form.Label>{uiText.attachment}</Form.Label>
          <Form.Control onChange={changeFile} type='file' />
        </Form.Group>
        <LoaderButton
          lang={lang}
          block='true'
          type='submit'
          size='lg'
          variant='primary'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          {uiText.create}
        </LoaderButton>
      </Form>
    </StyledNewNote>
  );
};

export default NewNote;
