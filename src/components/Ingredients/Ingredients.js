import React, { useReducer, useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch(
      'https://react-hooks-248e2-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        dispatch({ type: 'ADD', ingredient: { id: data.name, ...ingredient } });
      })
      .catch(err => {
        setError('Something went wrong!');
        setIsLoading(false);
      });
  };

  // Would set ingredients after page load too
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  // remove ingredient from firebase
  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-248e2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(() => {
        dispatch({ type: 'DELETE', id: ingredientId });
        setIsLoading(false);
      })
      .catch(err => {
        setError('We Screwed');
        setIsLoading(false);
      });
  };

  // will clear error & hide ErrorModal
  const clearError = () => {
    setError();
  };
  return (
    <main className='App'>
      {error && <ErrorModal onClose={clearError} />}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
        onClose={clearError}
        error={error}
        setError={setError}
      />

      <section>
        <Search
          onLoadIngredients={filteredIngredientsHandler}
          setIsLoading={setIsLoading}
          error={error}
          setError={setError}
          onClose={clearError}
        />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </main>
  );
};

export default Ingredients;
