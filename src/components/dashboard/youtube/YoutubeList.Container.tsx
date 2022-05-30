import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { APIYoutube } from 'src/lib/api';
import { IYoutube } from 'src/types/youtube';
import YoutubeListPresenter from './YoutubeList.Presenter';

export enum YoutubeListActionKind {
  //loading
  LOADING = 'LOADING',
  // Load APIS
  GET_YOUTUBE = 'GET_YOUTUBE',
  GET_YOUTUBE_LENGTH = 'GET_YOUTUBE_LENGTH',
  // changes
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  // delete & update
  SELECT_FEED = 'SELECT_FEED',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
}

export interface YoutubeListAction {
  type: YoutubeListActionKind;
  payload?: any;
}

export interface YoutubeListState {
  loading: boolean;
  page: number;
  listLength: number;
  list: IYoutube[];
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

const initialState: YoutubeListState = {
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

const YoutubeListReducer = (
  state: YoutubeListState,
  action: YoutubeListAction,
): YoutubeListState => {
  const { type, payload } = action;
  switch (type) {
    case YoutubeListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case YoutubeListActionKind.GET_YOUTUBE:
      return {
        ...state,
        list: payload.data,
        loading: false,
      };
    case YoutubeListActionKind.GET_YOUTUBE_LENGTH:
      return {
        ...state,
        listLength: payload,
        loading: false,
      };
    case YoutubeListActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
      };
    case YoutubeListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
    case YoutubeListActionKind.CHANGE_LIMIT:
      return {
        ...state,
        query: { ...state.query, _limit: payload },
      };
    case YoutubeListActionKind.OPEN_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    case YoutubeListActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };
    case YoutubeListActionKind.SELECT_FEED: {
      return {
        ...state,
        selected: payload,
      };
    }
  }
};

const YoutubeListContainer = () => {
  const [youtubeListState, dispatch] = useReducer(
    YoutubeListReducer,
    initialState,
  );
  const { query } = youtubeListState;

  // * 리스트 불러오기
  const getYoutubeList = useCallback(async () => {
    try {
      const { data: length } = await APIYoutube.getYoutubeListLength(
        query,
      );
      const { data, status } = await APIYoutube.getYoutubeList(query);
      if (status === 200) {
        dispatch({
          type: YoutubeListActionKind.GET_YOUTUBE,
          payload: { data },
        });
        dispatch({
          type: YoutubeListActionKind.GET_YOUTUBE_LENGTH,
          payload: length,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [query]);

  // * 삭제
  const handleDelete = async () => {
    try {
      await APIYoutube.deleteYoutube(youtubeListState.selected);
      dispatch({
        type: YoutubeListActionKind.CLOSE_DELETE_DIALOG,
      });
      getYoutubeList();
      toast.success('삭제됐습니다.');
    } catch (e) {
      toast.error('오류가 생겼습니다.');
      console.log(e);
    }
  };

  useEffect(() => {
    getYoutubeList();
  }, [getYoutubeList]);

  return (
    <YoutubeListPresenter
      dispatch={dispatch}
      handleDelete={handleDelete}
      youtubeListState={youtubeListState}
    />
  );
};
export default YoutubeListContainer;
