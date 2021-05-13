import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import { AuthContext } from './Providers/authContext';
import Auth from './components/Auth';

const App = props => {
  const authContext = useContext(AuthContext);

  let content = <Auth />;
  
  // check if user is loged in or not
  if (authContext.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;
