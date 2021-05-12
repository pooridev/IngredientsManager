import React, { useReducer, useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

/*
 * Ingredients Reducer to
 * handle adding, filtering
 * and deleting ingredients
 */
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

const httpsReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false };
    case 'ERROR':
      return { ...currentHttpState, error: action.errorMessage };
    case 'CLEAR_ERR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('Should not reach out here');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpsReducer, {
    loading: false,
    error: null
  });
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const addIngredientHandler = ingredient => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
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
        // setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
        dispatch({ type: 'ADD', ingredient: { id: data.name, ...ingredient } });
      })
      .catch(err => {
        // setError('Something went wrong!');
        // setIsLoading(false);
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  };

  // Would set ingredients after page load too
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  // remove ingredient from firebase
  const removeIngredientHandler = ingredientId => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch(
      `https://react-hooks-248e2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(() => {
        dispatch({ type: 'DELETE', id: ingredientId });
        // setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
      })
      .catch(err => {
        // setError('We Screwed');
        // setIsLoading(false);
        dispatchHttp({ type: 'ERROR' });
      });
  };

  // would clear error & hide ErrorModal
  const clearError = () => {
    // setError();
    dispatchHttp({ type: 'CLEAR_ERR' });
  };
  return (
    <main className='App'>
      {httpState.error && <ErrorModal onClose={clearError} />}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        onClose={clearError}
        httpState={httpState}
        dispatchHttp={dispatchHttp}
      />

      <section>
        <Search
          onLoadIngredients={filteredIngredientsHandler}
          error={httpState.error}
          onClose={clearError}
          dispatchHttp={dispatchHttp}
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
