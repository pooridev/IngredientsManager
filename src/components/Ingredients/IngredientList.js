import React from 'react';

import './IngredientList.css';

const IngredientList = props => {
  const { onRemoveItem, ingredients } = props;
  return (
    <section className='ingredient-list'>
      <h2>Loaded Ingredients</h2>
      <ul>
        {ingredients.map(ig => (
          <li
            key={Math.floor(Math.random() * 999)}
            onClick={onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
