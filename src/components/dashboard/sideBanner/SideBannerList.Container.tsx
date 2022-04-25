import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { APISideBanner } from 'src/lib/api';
import { ISideBanner } from 'src/types/sidebanner';
import SideBannerListPresenter from './SideBannerList.Presenter';

export enum SideBannerListActionKind {
  //loading
  LOADING = 'LOADING',

  // Load APIS
  GET_SIDE_BANNER = 'GET_SIDE_BANNER',
  GET_SIDE_BANNER_LENGTH = 'GET_SIDE_BANNER_LENGTH',

  // changes
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',

  // delete & update
  SELECT_FEED = 'SELECT_FEED',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
}

export interface SideBannerListAction {
  type: SideBannerListActionKind;
  payload?: any;
}

export interface SideBannerListState {
  loading: boolean;
  page: number;
  listLength: number;
  list: ISideBanner[];
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

const initialState: SideBannerListState = {
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

const SideBannerListReducer = (
  state: SideBannerListState,
  action: SideBannerListAction,
): SideBannerListState => {
  const { type, payload } = action;
  switch (type) {
    case SideBannerListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case SideBannerListActionKind.GET_SIDE_BANNER:
      return {
        ...state,
        list: payload.data,
        listLength: payload.length,
        loading: false,
      };
    case SideBannerListActionKind.GET_SIDE_BANNER_LENGTH:
      return {
        ...state,
        listLength: payload,
        loading: false,
      };
    case SideBannerListActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
      };
    case SideBannerListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
    case SideBannerListActionKind.CHANGE_LIMIT:
      return {
        ...state,
        query: { ...state.query, _limit: payload },
      };
    case SideBannerListActionKind.OPEN_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    case SideBannerListActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };
    case SideBannerListActionKind.SELECT_FEED: {
      return {
        ...state,
        selected: payload,
      };
    }
  }
};

const SideBannerListContainer = () => {
  const [sideBannerListState, dispatch] = useReducer(
    SideBannerListReducer,
    initialState,
  );
  const { query } = sideBannerListState;

  // * 리스트 불러오기
  const getSideBannerList = useCallback(async () => {
    dispatch({ type: SideBannerListActionKind.LOADING });
    try {
      const { data, status } = await APISideBanner.getSideBannerList(
        query,
      );
      const response = await APISideBanner.getSideBannerListLength(
        query,
      );
      if (status === 200) {
        dispatch({
          type: SideBannerListActionKind.GET_SIDE_BANNER,
          payload: { data, length: response.data },
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [query]);

  const handleDelete = async () => {
    try {
      await APISideBanner.deleteSideBanner(
        sideBannerListState.selected,
      );
      dispatch({
        type: SideBannerListActionKind.CLOSE_DELETE_DIALOG,
      });
      getSideBannerList();
      toast.success('데일리가 삭제됐습니다.');
    } catch (e) {
      toast.error('오류가 생겼습니다.');
      console.log(e);
    }
  };

  useEffect(() => {
    getSideBannerList();
  }, [getSideBannerList]);

  return (
    <SideBannerListPresenter
      dispatch={dispatch}
      handleDelete={handleDelete}
      getSideBannerList={getSideBannerList}
      sideBannerListState={sideBannerListState}
    />
  );
};

export default SideBannerListContainer;
