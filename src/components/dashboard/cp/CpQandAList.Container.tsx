import { useCallback, useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { APICp } from 'src/lib/api';
import { ICPQuestion } from 'src/types/cp';
import { IRoleType, IUser } from 'src/types/user';
import CPQandAListPresenter from './CpQandAList.Presenter';

export enum CPQandAActionKind {
  LOADING = 'LOADING',
  GET_LIST = 'GET_USERS',
  GET_LIST_LENGTH = 'GET_LIST_LENGTH',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_FILTER = 'CHANGE_FILTER',
  CHANGE_PAGE = 'CHANGE_PAGE',
}

export interface CpListAction {
  type: CPQandAActionKind;
  payload?: any;
}

export interface ICPQandAListState {
  loading: boolean;
  questionLength: 0;
  questions: ICPQuestion[];
  page: number;
  query: {
    _start: number;
    _limit: number;
    _q: string;
    _sort: string;
  };
  filter: string;
}

export const sortOption = [
  { title: '전체', value: '' },
  { title: '미완료', value: 'isCompleted=false' },
];

const initialState: ICPQandAListState = {
  loading: true,
  questions: [],
  questionLength: 0,
  page: 1,
  query: {
    _q: '',
    _start: 0,
    _limit: 10,
    _sort: 'created_at:DESC',
  },
  filter: sortOption[0].value,
};

const CPQandAReducer = (
  state: ICPQandAListState,
  action: CpListAction,
): ICPQandAListState => {
  const { type, payload } = action;
  switch (type) {
    case CPQandAActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CPQandAActionKind.GET_LIST:
      return {
        ...state,
        questions: payload,
        loading: false,
      };
    case CPQandAActionKind.GET_LIST_LENGTH:
      return {
        ...state,
        questionLength: payload,
      };
    case CPQandAActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _start: 0,
          _q: payload,
        },
        page: 1,
      };
    case CPQandAActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
    case CPQandAActionKind.CHANGE_FILTER:
      return {
        ...state,
        filter: payload,
      };
  }
};

const CPQandAListContainer = () => {
  const [state, dispatch] = useReducer(CPQandAReducer, initialState);

  const { user } = useAuth();
  const { query, filter } = state;

  const getQuestions = useCallback(async () => {
    dispatch({ type: CPQandAActionKind.LOADING, payload: true });
    try {
      const cpID = user.type === 'cp' ? user.id : null;
      const { status, data } = await APICp.getQandAList(
        query,
        filter,
        cpID,
      );
      const { data: dataLength } = await APICp.getQandALength(
        query,
        filter,
      );
      if (status === 200) {
        dispatch({
          type: CPQandAActionKind.GET_LIST,
          payload: data,
        });
        dispatch({
          type: CPQandAActionKind.GET_LIST_LENGTH,
          payload: dataLength,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [query, user, filter]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  return <CPQandAListPresenter state={state} dispatch={dispatch} />;
};

export default CPQandAListContainer;
