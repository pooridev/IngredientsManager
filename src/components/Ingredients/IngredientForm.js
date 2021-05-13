import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorModal from '../UI/ErrorModal';

const IngredientForm = React.memo(props => {
  // props
  const { onAddIngredient, httpState, dispatchHttp, onClose } = props;

  // states
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  // methods
  const submitHandler = event => {
    event.preventDefault();
    if (enteredTitle === '' || enteredAmount === '') {
      return dispatchHttp({
        type: 'ERROR',
        errorMessage: "Please Don't leave any inputs alone 😪"
      });
    }
    onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className='ingredient-form'>
      {httpState.error && (
        <ErrorModal onClose={onClose}>{httpState.error}</ErrorModal>
      )}
      <Card>
        <form onSubmit={submitHandler}>
          <div className='form-control'>
            <label htmlFor='title'>Name</label>
            <input
              type='text'
              id='title'
              value={enteredTitle}
              onChange={e => {
                setEnteredTitle(e.target.value);
              }}
            />
          </div>
          <div className='form-control'>
            <label htmlFor='amount'>Amount</label>
            <input
              min='1'
              max='99'
              type='number'
              id='amount'
              value={enteredAmount}
              onChange={e => {
                setEnteredAmount(e.target.value);
              }}
            />
          </div>
          <div className='ingredient-form__actions'>
            <button type='submit'>Add Ingredient</button>
            {httpState.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
