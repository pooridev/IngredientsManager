import React, { useMemo, useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/useHttp';

const IngredientForm = React.memo(props => {
  // props
  const { onAddIngredient, isLoading } = props;

  // states
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  // custome hook
  const { error, customeErrorHandler } = useHttp();

  // send input values for parent
  const submitHandler = event => {
    event.preventDefault();
    if (enteredTitle === '' || enteredAmount === '') {
      return customeErrorHandler();
    }
    onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className='ingredient-form'>
      {error && <ErrorModal>Please do not leave any input alone</ErrorModal>}
      <Card>
        <form onSubmit={submitHandler}>
          <div className='form-control'>
            <label htmlFor='title'>Name</label>
            <input
              type='text'
              id='title'
              value={enteredTitle}
              onChange={e => setEnteredTitle(e.target.value)}
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
              onChange={e => setEnteredAmount(e.target.value)}
            />
          </div>
          <div className='ingredient-form__actions'>
            <button type='submit'>Add Ingredient</button>
            {isLoading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
