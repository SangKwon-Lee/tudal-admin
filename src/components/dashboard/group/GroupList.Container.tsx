import { useCallback, useEffect, useReducer } from 'react';
import { APIGroup } from 'src/lib/api';
import GroupListPresenter from './GroupList.Presenter';
import { IGroup } from 'src/types/group';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
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
  SELECT_FEED = 'SELECT_FEED',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
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
    _sort: string;
  };
  delete: {
    isDeleting: boolean;
    target: number;
  };
}

const initialState: GroupListTableState = {
  loading: true,
  list: [],
  listLength: 0,
  selected: [],
  page: 1,
  query: {
    _q: '',
    _start: 0,
    _limit: 20,
    _sort: 'created_at:DESC',
  },
  delete: {
    isDeleting: false,
    target: null,
  },
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
        query: { ...state.query, _sort: payload },
      };
    case GroupListTableActionKind.OPEN_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    case GroupListTableActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };
    case GroupListTableActionKind.SELECT_FEED: {
      return {
        ...state,
        selected: payload,
      };
    }
  }
};

const CouponListTableContainer = () => {
  const [groupListTableState, dispatch] = useReducer(
    CouponListTableReducer,
    initialState,
  );
  const navigate = useNavigate();

  const { query } = groupListTableState;

  //* 데일리 리스트 불러오기
  const getGroupList = useCallback(async () => {
    dispatch({ type: GroupListTableActionKind.LOADING });

    const { data, status } = await APIGroup.getGroups(query);
    try {
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

  const handleDelete = async () => {
    try {
      const { data: Favorites } = await APIGroup.getFavorites(
        groupListTableState.selected,
      );
      await Promise.all(
        Favorites.map(async (favorites) => {
          return await APIGroup.deleteFavorites(favorites.id);
        }),
      );
      await APIGroup.deleteGroup(groupListTableState.selected);
      dispatch({
        type: GroupListTableActionKind.CLOSE_DELETE_DIALOG,
      });
      getGroupList();
      toast.success('데일리가 삭제됐습니다.');
      navigate(`/dashboard/groups`);
    } catch (e) {
      toast.error('오류가 생겼습니다.');
      navigate(`/dashboard/groups`);
      console.log(e);
    }
  };

  useEffect(() => {
    getGroupList();
  }, [getGroupList]);

  return (
    <GroupListPresenter
      groupListTableState={groupListTableState}
      dispatch={dispatch}
      handleDelete={handleDelete}
      getGroupList={getGroupList}
    />
  );
};

export default CouponListTableContainer;
