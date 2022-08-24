import React, {useState, useContext} from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import AppContext from '../store/app-context';
import LoaderButton from './UI/LoaderButton';
import {useFormFields} from '../store/hooksLib';
import data from '../store/content/billing';

const StyledBillingForm = styled.section`
  .rtl & :not(btn) {
    font-family: Lotus;
    font-size: 1.2rem;
  }

  .rtl & input {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  .rtl & input:placeholder-shown {
    direction: rtl;
  }
  .rtl & .storage-input:not(:placeholder-shown) {
    direction: ltr;
  }

  & .card-field {
    line-height: 1.5;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    padding: 0.55rem 0.75rem;
    background-color: white;
    border: 1px solid #ced4da;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  & .card-field.StripeElement--focus {
    outline: 0;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const BillingForm = ({isLoading, onSubmit}) => {
  const {lang} = useContext(AppContext);
  const uiText = data[lang];
  const stripe = useStripe();
  const elements = useElements();
  const [fields, changeFields] = useFormFields({
    name: '',
    storage: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  isLoading = isProcessing || isLoading;

  const validateForm = () => {
    return (
      stripe &&
      elements &&
      fields.name !== '' &&
      fields.storage !== '' &&
      isCardComplete
    );
  };

  const submit = async evt => {
    evt.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const {token, error} = await stripe.createToken(cardElement);

    setIsProcessing(false);

    onSubmit(fields.storage, {token, error});
  };

  return (
    <StyledBillingForm>
      <Form onSubmit={submit}>
        <Form.Group size='lg' controlId='storage'>
          <Form.Label>{uiText.storage}</Form.Label>
          <Form.Control
            className='storage-input'
            dir='auto'
            min='0'
            type='number'
            value={fields.storage}
            onChange={changeFields}
            placeholder={uiText.storagePH}
          />
        </Form.Group>
        <hr />
        <Form.Group size='lg' controlId='name'>
          <Form.Label>{uiText.cardName}</Form.Label>
          <Form.Control
            dir='auto'
            type='text'
            value={fields.name}
            onChange={changeFields}
            placeholder={uiText.cardNamePH}
          />
        </Form.Group>
        <Form.Label>{uiText.cardInfo}</Form.Label>
        <CardElement
          className='card-field'
          dir='ltr'
          onChange={evt => setIsCardComplete(evt.complete)}
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#495057',
                fontFamily: "'Open Sans', sans-serif",
              },
            },
          }}
        />
        <LoaderButton
          lang={lang}
          className='btn'
          block='true'
          size='lg'
          type='submit'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          {uiText.purchase}
        </LoaderButton>
      </Form>
    </StyledBillingForm>
  );
};

export default BillingForm;
