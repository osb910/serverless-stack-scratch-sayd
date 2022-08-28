import React, {useState, useContext} from 'react';
import Form from 'react-bootstrap/Form';
import {useNavigate, useLocation} from 'react-router-dom';
import {Auth} from 'aws-amplify';
import AppContext from '../store/app-context';
import {useFormFields} from '../store/hooksLib';
// import {onError} from '../store/errorLib';
import data from '../store/content/header';
import {emailRgx, pwdRgx} from '../store/utils';
import StyledForm from '../components/UI/StyledForm';
import LoaderButton from '../components/UI/LoaderButton';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Signup = props => {
  const {lang, isAuthented, setIsAuthented} = useContext(AppContext);
  const uiText = data[lang];

  const {state} = useLocation();
  const [fields, changeFields] = useFormFields({
    email: state?.email || '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });

  const nav = useNavigate();

  const [newUser, setNewUser] = useState(state?.newUser || null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  const validateForm = () => {
    return (
      emailRgx.test(fields.email) &&
      pwdRgx.test(fields.password) &&
      fields.password === fields.confirmPassword
    );
  };

  const validateConfirmationForm = () => {
    return fields.confirmationCode.length === 6;
  };

  const onExcConfReq = () => {
    setSubmitMsg(uiText.tooMuchConfReq);
  };

  const resendConfirmation = async () => {
    try {
      await Auth.resendSignUp(fields.email);
      setSubmitMsg(uiText.unconfirmedUserMsg);
      setTimeout(() => {
        setIsLoading(false);
        setNewUser(fields.email);
      }, 2000);
    } catch (err) {
      console.log(err);
      err.name === 'LimitExceededException' && onExcConfReq();
    }
  };

  const redirectToLogin = () => {
    setSubmitMsg(uiText.userExists);
    setTimeout(() => {
      setIsLoading(false);
      nav('/login', {state: {email: fields.email}});
    }, 2000);
  };

  const handleExistingUser = async () => {
    try {
      const res = await Auth.signIn(fields.email, fields.password);
      console.log(res);
      await Auth.signOut();
      redirectToLogin();
    } catch (err) {
      console.log(err);
      err.name === 'NotAuthorizedException' && redirectToLogin();
      err.name === 'UserNotConfirmedException' && (await resendConfirmation());
    }
  };

  const submit = async evt => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });

      setIsLoading(false);
      setNewUser(newUser);
    } catch (err) {
      err.name === 'UsernameExistsException' && (await handleExistingUser());
      setIsLoading(false);
    }
  };

  const confirmSubmit = async evt => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      setIsAuthented('LOGIN');
      setTimeout(() => nav('/'), 2000);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const confirmationForm = (
    <Form onSubmit={confirmSubmit}>
      <Form.Group controlId='confirmationCode' size='lg' className='group'>
        <Form.Label>{uiText.confCode}</Form.Label>
        <Form.Control
          dir='auto'
          autoFocus
          type='tel'
          onChange={changeFields}
          value={fields.confirmationCode}
        />
        <Form.Text muted className='form-text'>
          {uiText.confCodeText}
        </Form.Text>
      </Form.Group>
      <Form.Group className='group'>
        <LoaderButton
          lang={lang}
          block='true'
          size='lg'
          type='submit'
          variant='success'
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          {uiText.verify}
        </LoaderButton>
        {submitMsg && (
          <Form.Text className='text-muted form-text'>{submitMsg}</Form.Text>
        )}
      </Form.Group>
    </Form>
  );

  const form = (
    <Form onSubmit={submit}>
      <Form.Group controlId='email' size='lg' className='group'>
        <Form.Label>{uiText.email}</Form.Label>
        <Form.Control
          autoFocus
          type='email'
          value={fields.email}
          onChange={changeFields}
          dir='auto'
        />
      </Form.Group>
      <Form.Group controlId='password' size='lg' className='group'>
        <Form.Label>{uiText.pass}</Form.Label>
        <Form.Control
          type='password'
          value={fields.password}
          onChange={changeFields}
          dir='auto'
        />
        {/* <Form.Text className='text-muted form-text'>
          {uiText.signupPassText}
        </Form.Text> */}
      </Form.Group>
      <Form.Group controlId='confirmPassword' size='lg' className='group'>
        <Form.Label>{uiText.confirmPass}</Form.Label>
        <Form.Control
          type='password'
          onChange={changeFields}
          value={fields.confirmPassword}
          dir='auto'
        />
      </Form.Group>
      <Form.Group className='group'>
        <LoaderButton
          lang={lang}
          block='true'
          size='lg'
          type='submit'
          variant='success'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          {uiText.signup}
        </LoaderButton>
        {submitMsg && (
          <Form.Text className='text-muted form-text'>{submitMsg}</Form.Text>
        )}
      </Form.Group>
    </Form>
  );

  return <StyledForm>{newUser ? confirmationForm : form}</StyledForm>;
};

export default Signup;
