import { useCallback, useEffect, useReducer } from 'react';
import { APICp } from 'src/lib/api';
import { IUser } from 'src/types/user';
import CpListPresenter from './CpList.Presenter';
import crypto from 'crypto';
export enum CpListActionKind {
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  GET_LIST_LENGTH = 'GET_LIST_LENGTH',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
}

export interface CpListAction {
  type: CpListActionKind;
  payload?: any;
}

export interface CpListState {
  loading: boolean;
  cpListLength: 0;
  cpList: IUser[];
  page: number;
  query: {
    _start: number;
    _limit: number;
    _q: string;
    _sort: string;
  };
}

const initialState: CpListState = {
  loading: true,
  cpList: [],
  cpListLength: 0,
  page: 1,
  query: {
    _q: '',
    _start: 0,
    _limit: 50,
    _sort: 'created_at:DESC',
  },
};
const randomString = crypto.randomBytes(20).toString('hex');
console.log(randomString);
const CpListReducer = (
  state: CpListState,
  action: CpListAction,
): CpListState => {
  const { type, payload } = action;
  switch (type) {
    case CpListActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CpListActionKind.GET_USERS:
      return {
        ...state,
        cpList: payload,
        loading: false,
      };
    case CpListActionKind.GET_LIST_LENGTH:
      return {
        ...state,
        cpListLength: payload,
      };
    case CpListActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _start: 0,
          _q: payload,
        },
        page: 1,
      };
    case CpListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
  }
};

const CpListContainer = () => {
  const [cpListState, dispatch] = useReducer(
    CpListReducer,
    initialState,
  );

  //*유저 목록 불러오기
  const getUsers = useCallback(async () => {
    dispatch({ type: CpListActionKind.LOADING, payload: true });
    try {
      const { status, data } = await APICp.getCpUsers(
        cpListState.query,
      );
      const { data: dataLength } = await APICp.getCpUsersLegnth(
        cpListState.query,
      );
      if (status === 200) {
        dispatch({
          type: CpListActionKind.GET_USERS,
          payload: data,
        });
        dispatch({
          type: CpListActionKind.GET_LIST_LENGTH,
          payload: dataLength,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [cpListState.query]);

  useEffect(() => {
    getUsers();
  }, [getUsers, cpListState.query]);

  return (
    <CpListPresenter cpListState={cpListState} dispatch={dispatch} />
  );
};

export default CpListContainer;
