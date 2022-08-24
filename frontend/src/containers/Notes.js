import React, {useRef, useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {useParams, useNavigate} from 'react-router-dom';
import {API, Storage} from 'aws-amplify';
import Form from 'react-bootstrap/Form';
// import {onError} from '../lib/errorLib';
import AppContext from '../store/app-context';
import data from '../store/content/notes';
import config from '../config';
import LoaderButton from '../components/UI/LoaderButton';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {s3Delete, s3Upload} from '../store/awsLib';

const StyledNotes = styled.section`
  min-height: 300px;
  font-size: 1.5rem;

  & .attachment {
  }

  & .filename-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4em;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  & .attachment img {
    width: 100%;
    max-width: 28rem;
    max-height: 28rem;
    border-radius: 5px;
    filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2));
  }

  & .btns {
    margin-bottom: 0.5em;
    display: flex;
    gap: 1em;
    justify-content: center;
  }
`;

const Notes = () => {
  const {lang} = useContext(AppContext);
  const uiText = data[lang];
  const file = useRef(null);
  const {id} = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [noteMsg, setNoteMsg] = useState('');

  useEffect(() => {
    const loadNote = () => API.get('notes', `/notes/${id}`);

    const onLoad = async () => {
      try {
        setIsLoading(true);
        const note = await loadNote();
        setNoteMsg('');
        const {content, attachment} = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    onLoad();
  }, [id]);

  const validateForm = () => !/^\s*$/.test(content);

  const formatFilename = str => str.replace(/^\w+-/, '');

  const changeFile = evt => (file.current = evt.target.files[0]);

  const saveNote = note =>
    API.put('notes', `/notes/${id}`, {
      body: note,
    });

  const submit = async evt => {
    let attachment;
    evt.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(uiText.largeFileSize);
      return;
    }

    setIsSaving(true);

    try {
      if (file.current) {
        const removed = await s3Delete(note.attachment);
        console.log(removed);
        attachment = await s3Upload(file.current);
      }

      if (!file.current && note.content === content) {
        setIsSaving(false);
        setNoteMsg(uiText.noChange);
        return;
      }

      setNoteMsg('');

      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });

      nav('/');
    } catch (err) {
      console.log(err);
      setIsSaving(false);
    }
  };

  const delNote = () => API.del('notes', `/notes/${id}`);

  const handleDeletion = async evt => {
    evt.preventDefault();

    const confirmed = window.confirm(uiText.delConfirmation);

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const removed = await s3Delete(note.attachment);
      console.log(removed);
      await delNote();
      nav('/');
    } catch (err) {
      console.log(err);
      setIsDeleting(false);
    }
  };

  return (
    <StyledNotes>
      {isLoading && <LoadingSpinner lang={lang} />}
      {note && !isLoading && (
        <Form onSubmit={submit}>
          <Form.Group controlId='content'>
            <Form.Control
              dir='auto'
              as='textarea'
              value={content}
              onChange={evt => setContent(evt.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='file'>
            <Form.Label>{uiText.attachment}</Form.Label>
            {note.attachment && (
              <p className='attachment'>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={note.attachmentURL}
                  className='filename-link'
                >
                  {formatFilename(note.attachment)}
                  <img src={note.attachmentURL} alt='' />
                </a>
              </p>
            )}
            <Form.Control onChange={changeFile} type='file' />
          </Form.Group>
          <Form.Group className='btns'>
            <LoaderButton
              lang={lang}
              block='true'
              size='lg'
              type='submit'
              isLoading={isSaving}
              disabled={!validateForm()}
            >
              {uiText.save}
            </LoaderButton>
            <LoaderButton
              lang={lang}
              block='true'
              size='lg'
              variant='danger'
              onClick={handleDeletion}
              isLoading={isDeleting}
            >
              {uiText.delete}
            </LoaderButton>
          </Form.Group>
          <Form.Text className='text-muted'>{noteMsg}</Form.Text>
        </Form>
      )}
    </StyledNotes>
  );
};

export default Notes;
