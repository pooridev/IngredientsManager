import React, { useEffect, useState, useRef } from 'react';
import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  // props
  const { onLoadIngredients, error, onClose, dispatchHttp } = props;

  // states
  const [enteredFilter, setEnteredFilter] = useState('');

  // refs
  const inputRef = useRef();

  // methods
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        dispatchHttp({ type: 'SEND' });
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          'https://react-hooks-248e2-default-rtdb.firebaseio.com/ingredients.json' +
            query
        )
          .then(res => res.json())
          .then(data => {
            dispatchHttp({ type: 'RESPONSE' });
            const loadedIngredients = [];
            for (const key in data) {
              loadedIngredients.push({
                id: key,
                title: data[key].title,
                amout: data[key].amout
              });
            }
            onLoadIngredients(loadedIngredients);
          })
          .catch(error => {
            // setError('Something went wrong!');
            // setIsLoading(false);
            dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
          });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef, dispatchHttp]);
  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type='text'
            value={enteredFilter}
            onChange={e => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
      {error && <ErrorModal onClose={onClose}>{error}</ErrorModal>}
    </section>
  );
});

export default Search;
