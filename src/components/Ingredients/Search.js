import React, { useEffect, useState, useRef } from 'react';
import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/useHttp';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  // props
  const { onLoadIngredients } = props;

  // states
  const [enteredFilter, setEnteredFilter] = useState('');

  // refs
  const inputRef = useRef();

  // http hook
  const { error, isLoading, sendRequest, data, clear } = useHttp();

  // methods
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          `https://react-hooks-248e2-default-rtdb.firebaseio.com/ingredients.json${query}`,
          'GET'
        );
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [error, isLoading, data, onLoadIngredients]);

  return (
    <section className='search'>
      {error && <ErrorModal onClose={clear}>Something went wrong</ErrorModal>}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type='text'
            value={enteredFilter}
            onChange={e => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
