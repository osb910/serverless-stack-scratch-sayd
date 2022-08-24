import React, {useState, useContext} from 'react';
import styled from 'styled-components';
import {API} from 'aws-amplify';
import {useNavigate} from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
// import { onError } from "../lib/errorLib";
import AppContext from '../store/app-context';
import config from '../config';
import data from '../store/content/billing';
import BillingForm from '../components/BillingForm';

const StyledSettings = styled.section`
  @media all and (min-width: 480px) {
    padding: 60px 0;

    & form {
      margin: 0 auto;
      max-width: 480px;
    }
  }
`;

const Settings = () => {
  const {lang} = useContext(AppContext);
  const uiText = data[lang];
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const stripePromise = loadStripe(config.STRIPE_KEY);

  const billUser = details => {
    return API.post('notes', '/billing', {
      body: details,
    });
  };

  const submitForm = async (storage, {token, err}) => {
    if (err) {
      console.log(err);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });
      alert(uiText.chargeSuccess);
      nav('/');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <StyledSettings>
      <Elements
        stripe={stripePromise}
        fonts={[
          {
            cssSrc:
              'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800',
          },
        ]}
      >
        <BillingForm isLoading={isLoading} onSubmit={submitForm} />
      </Elements>
    </StyledSettings>
  );
};

export default Settings;
