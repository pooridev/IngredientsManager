import { useCallback, useReducer } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  reqIdentifier: null
};

// state reducer
const httpsReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return {
        ...currentHttpState,
        error: action.errorMessage,
        loading: false
      };
    case 'CLEAR':
      return initialState;
    case 'CUSTOME_ERROR':
      return {
        ...currentHttpState,
        error: true
      };
    default:
      throw new Error('Should not reach out here');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpsReducer, initialState);

  // clear state
  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  // to set custome error message
  const customeErrorHandler = useCallback(
    () => dispatchHttp({ type: 'CUSTOME_ERROR' }),
    []
  );

  const sendRequest = useCallback((url, method, body, reqExtra, identifier) => {
    dispatchHttp({ type: 'SEND', identifier: identifier });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        dispatchHttp({
          type: 'RESPONSE',
          responseData: data,
          extra: reqExtra
        });
      })
      .catch(err => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear,
    customeErrorHandler: customeErrorHandler
  };
};

export default useHttp;
