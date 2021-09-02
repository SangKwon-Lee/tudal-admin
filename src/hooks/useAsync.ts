import { AxiosError } from 'axios';
import { useReducer, useEffect, useCallback } from 'react';

interface ReturnedData<TResponse> {
  data: TResponse;
  loading: boolean;
  error: AxiosError<any> | boolean;
}

type finalReturn<T> = [ReturnedData<T>, () => void];

function init(initialCount) {
  return initialCount;
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, data: state.data, error: null };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        data: state.data,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export function useAsync<T>(
  callback,
  deps = [],
  initialState = null,
): finalReturn<T> {
  const [state, dispatch] = useReducer(
    reducer,
    {
      data: initialState,
      loading: true,
      error: null,
    },
    init,
  );

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const { data } = await callback();

      console.log('inside', data);
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return [state, fetchData];
}

export default useAsync;
