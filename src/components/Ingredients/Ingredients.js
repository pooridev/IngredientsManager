import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
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
        setIngredients(prevIngredients => {
          setIsLoading(false);
          return [...prevIngredients, { id: data.name, ...ingredient }];
        });
      })
      .catch(err => {
        setError('Something went wrong!');
        setIsLoading(false);
      });
  };

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  // remove ingredient from firebase
  const removeIngredientHandler = ingredientId => {
    fetch(
      `https://react-hooks-248e2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(() => {
        setIngredients(prev => {
          return prev.filter(ingredient => ingredient.id !== ingredientId);
        });
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
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </main>
  );
};

export default Ingredients;
