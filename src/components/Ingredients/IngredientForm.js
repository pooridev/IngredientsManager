import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorModal from '../UI/ErrorModal';

const IngredientForm = React.memo(props => {
  // props
  const { onAddIngredient, loading, error, setError, onClose } = props;

  // states
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  // methods
  const submitHandler = event => {
    event.preventDefault();
    if (enteredTitle === '' || enteredAmount === '') {
      return setError('You gotta add something');
    }
    onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className='ingredient-form'>
      {error && <ErrorModal onClose={onClose}>{error}</ErrorModal>}
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
            {loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
