import { useEffect, useReducer } from 'react';
import { APICp } from 'src/lib/api';
import { User } from 'src/types/user';
import CpListPresenter from './CpList.Presenter';

export enum CpListActionKind {
  // loading
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_SORT = 'CHANGE_SORT',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  CHANGE_ROOM = 'CHANGE_ROOM',
  CHANGE_CHANNEL = 'CHANGE_CHANNEL',

  // delete & update
  SELECT_FEED = 'SELECT_FEED',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
}

export interface CpListAction {
  type: CpListActionKind;
  payload?: any;
}

export interface CpListState {
  loading: boolean;
  user: User[];
}

const initialState: CpListState = {
  loading: true,
  user: [],
};

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
        user: payload,
        loading: false,
      };
  }
};

const CpListContainer = () => {
  const [cpListState, dispatch] = useReducer(
    CpListReducer,
    initialState,
  );

  const getUsers = async () => {
    dispatch({ type: CpListActionKind.LOADING, payload: true });
    try {
      const { status, data } = await APICp.getUsers();
      if (status === 200) {
        dispatch({
          type: CpListActionKind.GET_USERS,
          payload: data.filter(
            (data) => data.isMasterAvailable === true,
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(cpListState);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <CpListPresenter cpListState={cpListState} dispatch={dispatch} />
  );
};

export default CpListContainer;
