import { useReducer } from 'react';

const httpsReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false, data: action.responseData };
    case 'ERROR':
      return { ...currentHttpState, error: action.errorMessage };
    case 'CLEAR_ERR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('Should not reach out here');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpsReducer, {
    loading: false,
    error: null,
    data: null
  });

  const sendRequest = (url, method, body) => {
    dispatchHttp({ type: 'SEND' });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        dispatchHttp({ type: 'RESPONSE', responseData: data });
      })
      .catch(err => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  };

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest
  };
};

export default useHttp;
