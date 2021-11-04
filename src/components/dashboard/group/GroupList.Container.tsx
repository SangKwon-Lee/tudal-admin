import { useCallback, useEffect, useReducer } from 'react';
import { APICoupon, APIGroup } from 'src/lib/api';
import { CouponType } from 'src/types/coupon';
import CouponListTablePresenter from './GroupList.Presenter';
import toast from 'react-hot-toast';
import { IGroup } from 'src/types/group';
export enum GroupListTableActionKind {
  //loading
  LOADING = 'LOADING',

  // Load APIS
  GET_GROUP = 'GET_GROUP',
  GET_GROUP_LENGTH = 'GET_GROUP_LENGTH',

  // changes
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  CHANGE_ISUSED = 'CHANGE_ISUSED',
  CHANGE_SORT = 'CHANGE_SORT',

  // delete & update
  SELECT_COUPON = 'SELECT_COUPON',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
  OPEN_CREATE_DIALOG = 'OPEN_CREATE_DIALOG',
  CLOSE_CREATE_DIALOG = 'CLOSE_CREATE_DIALOG',
}

export interface GroupListTableAction {
  type: GroupListTableActionKind;
  payload?: any;
}

export interface GroupListTableState {
  loading: boolean;
  page: number;
  listLength: number;
  selected: number[];
  list: IGroup[];
  query: {
    _start: number;
    _limit: number;
    _q: string;
  };
  delete: {
    isDeleting: boolean;
    target: number;
  };
  sort: string;
}

const initialState: GroupListTableState = {
  loading: false,
  list: [],
  listLength: 0,
  selected: [],
  page: 1,
  query: {
    _q: '',
    _start: 0,
    _limit: 20,
  },
  delete: {
    isDeleting: false,
    target: null,
  },
  sort: 'created_at:DESC',
};

const CouponListTableReducer = (
  state: GroupListTableState,
  action: GroupListTableAction,
): GroupListTableState => {
  const { type, payload } = action;
  switch (type) {
    case GroupListTableActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case GroupListTableActionKind.GET_GROUP:
      return {
        ...state,
        list: payload.data,
        listLength: payload.length,
        loading: false,
      };
    case GroupListTableActionKind.GET_GROUP_LENGTH:
      return {
        ...state,
        listLength: payload,
        loading: false,
      };
    case GroupListTableActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
      };
    case GroupListTableActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
    case GroupListTableActionKind.CHANGE_LIMIT:
      return {
        ...state,
        query: { ...state.query, _limit: payload },
      };
    case GroupListTableActionKind.CHANGE_SORT:
      return {
        ...state,
        sort: payload,
      };
  }
};

const CouponListTableContainer = () => {
  const [groupListTableState, dispatch] = useReducer(
    CouponListTableReducer,
    initialState,
  );

  const { query } = groupListTableState;

  //* 쿠폰 리스트 불러오기
  const getGroupList = useCallback(async () => {
    dispatch({ type: GroupListTableActionKind.LOADING });
    try {
      const { data, status } = await APIGroup.getGroups(query);
      const response = await APIGroup.getGroupLength(query);
      if (status === 200) {
        dispatch({
          type: GroupListTableActionKind.GET_GROUP,
          payload: { data, length: response.data },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [query]);

  useEffect(() => {
    getGroupList();
  }, [getGroupList]);

  return (
    <CouponListTablePresenter
      groupListTableState={groupListTableState}
      dispatch={dispatch}
      getGroupList={getGroupList}
    />
  );
};

export default CouponListTableContainer;
