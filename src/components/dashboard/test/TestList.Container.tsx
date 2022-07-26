import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { APITest } from 'src/lib/api';
import { ITest } from 'src/types/test';
import TestListPresenter from './TestList.Presenter';

export enum TestListActionKind {
  //loading
  LOADING = 'LOADING',
  // Load APIS
  GET_TEST = 'GET_TEST',
  GET_TEST_LENGTH = 'GET_TEST_LENGTH',
  // changes
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  // delete & update
  SELECT_FEED = 'SELECT_FEED',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
}

export interface TestListAction {
  type: TestListActionKind;
  payload?: any;
}

export interface TestListState {
  loading: boolean;
  page: number;
  listLength: number;
  list: ITest[];
  selected: number[];
  query: {
    _start: number;
    _limit: number;
    _q: string;
    _sort: string;
  };
  delete: {
    isDeleting: boolean;
    target: number;
  };
}

const initialState: TestListState = {
  loading: true,
  list: [],
  listLength: 0,
  page: 1,
  selected: [],
  query: {
    _q: '',
    _start: 0,
    _limit: 20,
    _sort: 'created_at:desc',
  },
  delete: {
    isDeleting: false,
    target: null,
  },
};

const TestListReducer = (
  state: TestListState,
  action: TestListAction,
): TestListState => {
  const { type, payload } = action;
  switch (type) {
    case TestListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case TestListActionKind.GET_TEST:
      return {
        ...state,
        list: payload.data,
        loading: false,
      };
    case TestListActionKind.GET_TEST_LENGTH:
      return {
        ...state,
        listLength: payload,
        loading: false,
      };
    case TestListActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
      };
    case TestListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
    case TestListActionKind.CHANGE_LIMIT:
      return {
        ...state,
        query: { ...state.query, _limit: payload },
      };
    case TestListActionKind.OPEN_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    case TestListActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };
    case TestListActionKind.SELECT_FEED: {
      return {
        ...state,
        selected: payload,
      };
    }
  }
};

const TestListContainer = () => {
  const [testListState, dispatch] = useReducer(
    TestListReducer,
    initialState,
  );
  const { query } = testListState;

  const getTestList = useCallback(async () => {
    try {
      const { data: length } = await APITest.getTestListLength(query);
      const { data, status } = await APITest.getTestList(query);
      if (status === 200) {
        dispatch({
          type: TestListActionKind.GET_TEST,
          payload: { data },
        });
        dispatch({
          type: TestListActionKind.GET_TEST_LENGTH,
          payload: length,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [query]);

  return (
    <TestListPresenter
      dispatch={dispatch}
      //   handleDelete={handleDelete}
      testListState={testListState}
    />
  );
};

export default TestListContainer;
