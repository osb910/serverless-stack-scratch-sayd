import React, {useState, useContext} from 'react';
import {Auth} from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import {useNavigate, useLocation} from 'react-router-dom';
import AppContext from '../store/app-context';
import {useFormFields} from '../store/hooksLib';
// import {onError} from '../store/errorLib';
import data from '../store/content/header';
import {emailRgx, pwdRgx} from '../store/utils';
import StyledForm from '../components/UI/StyledForm';
import LoaderButton from '../components/UI/LoaderButton';
// import LoadingSpinner from '../components/UI/LoadingSpinner';

const Login = () => {
  const {lang, setIsAuthented, setCurrentUser} = useContext(AppContext);
  const uiText = data[lang];

  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const {state} = useLocation();

  const [fields, changeFields] = useFormFields({
    email: state?.email,
    password: '',
  });

  const [submitMsg, setSubmitMsg] = useState('');

  const validateForm = () => {
    return emailRgx.test(fields.email) && pwdRgx.test(fields.password);
  };

  const onExcConfReq = () => {
    setSubmitMsg(uiText.tooMuchConfReq);
  };

  const redirectToSignup = (msg, isNewUser) => {
    setSubmitMsg(msg);
    setTimeout(() => {
      setIsLoading(false);
      nav('/signup', {state: {email: fields.email, newUser: isNewUser}});
    }, 2000);
  };

  const resendConfirmation = async () => {
    try {
      await Auth.resendSignUp(fields.email);
      redirectToSignup(uiText.unconfirmedUserMsg, true);
    } catch (err) {
      console.log(err.name);
      if (err.name === 'LimitExceededException') {
        onExcConfReq();
      }
    }
  };

  const submit = async evt => {
    evt.preventDefault();
    setIsLoading(true);

    try {
      const signInProcess = await Auth.signIn(fields.email, fields.password);
      console.log(signInProcess);
      setCurrentUser({email: fields.email});
      setSubmitMsg(uiText.loginSuccess);
      setTimeout(() => {
        setIsLoading(false);
        setIsAuthented('LOGIN');
      }, 1500);
    } catch (err) {
      console.log(err.name, err.message);
      err.name === 'UserNotFoundException' &&
        redirectToSignup(uiText.userNotFound, false);
      err.name === 'UserNotConfirmedException' && (await resendConfirmation());
      err.message === 'Network error' && setSubmitMsg(uiText.netError);
      setIsLoading(false);
      setIsAuthented('LOGOUT');
    }
  };

  return (
    <StyledForm>
      <Form onSubmit={submit}>
        <Form.Group size='lg' controlId='email' className='group'>
          <Form.Label>{uiText.email}</Form.Label>
          <Form.Control
            autoFocus
            type='email'
            value={fields.email}
            onChange={changeFields}
            dir='auto'
          />
          {/* <Form.Text className='text-muted form-text'>{uiText.loginEmailText}</Form.Text> */}
        </Form.Group>
        <Form.Group size='lg' controlId='password' className='group'>
          <Form.Label>{uiText.pass}</Form.Label>
          <Form.Control
            type='password'
            value={fields.password}
            onChange={changeFields}
            dir='auto'
          />
          <Form.Text className='text-muted form-text'>
            {uiText.loginPassText}
          </Form.Text>
        </Form.Group>
        <Form.Group className='group'>
          <LoaderButton
            lang={lang}
            block='true'
            size='lg'
            type='submit'
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            {uiText.login}
          </LoaderButton>
          {submitMsg && (
            <Form.Text className='text-muted form-text'>{submitMsg}</Form.Text>
          )}
        </Form.Group>
      </Form>
    </StyledForm>
  );
};

export default Login;
