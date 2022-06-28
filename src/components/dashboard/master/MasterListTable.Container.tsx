import { useCallback, useEffect, useReducer } from 'react';
import { APIMaster } from 'src/lib/api';
import MasterListTablePresenter from './MasterListTable.Presenter';
import useAuth from 'src/hooks/useAuth';
import { IMaster, IMasterFeed, IMasterRoom } from 'src/types/master';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Feed } from '@material-ui/icons';

export enum MasterListTableActionKind {
  // loading
  LOADING = 'LOADING',
  DONE = 'DONE',
  CHANNEL_LOADING = 'CHANNEL_LOADING',
  ROOM_LOADING = 'ROOM_LOADING',

  // Load APIS
  GET_MASTER = 'GET_MASTER',
  GET_ROOM = 'GET_ROOM',
  GET_FEED = 'GET_FEED',
  GET_FEED_LENGTH = 'GET_FEED_LENGTH',

  // changes
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_SORT = 'CHANGE_SORT',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  CHANGE_ROOM = 'CHANGE_ROOM',
  CHANGE_MASTER = 'CHANGE_MASTER',

  // delete & update
  SELECT_FEED = 'SELECT_FEED',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
}

export interface MasterListTableAction {
  type: MasterListTableActionKind;
  payload?: any;
}

type Sort = 'datetime:desc' | 'datetime:asc';

interface SortOption {
  value: any;
  label: string;
}

export const sortOptions: SortOption[] = [
  {
    label: '등록순 (최신)',
    value: 'created_at:desc',
  },
  {
    label: '등록순 (오래된)',
    value: 'datetime:asc',
  },
];

export interface IMasterListState {
  loading: boolean;
  channelLoading: boolean;
  roomLoading: boolean;

  page: number;
  selected: number;
  list: {
    feed: IMasterFeed[];
    feedLength: number;
    masters: IMaster[];
    room: IMasterRoom[];
  };
  delete: {
    isDeleting: boolean;
    target: number;
  };
  query: {
    _start: number;
    _limit: number;
    _q: string;
    master: number;
    'master_room.id': number;
    'master_room.master_channel.id': number;
    _sort: string;
  };
}

const initialState: IMasterListState = {
  list: { masters: [], feed: [], feedLength: 0, room: [] },
  loading: true,
  channelLoading: true,
  roomLoading: true,
  selected: null,
  page: 1,
  delete: {
    isDeleting: false,
    target: null,
  },
  query: {
    _q: '',
    _start: 0,
    _limit: 20,
    master: null,
    'master_room.id': null,
    'master_room.master_channel.id': null,
    _sort: sortOptions[0].value,
  },
};

const MasterListTableReducer = (
  state: IMasterListState,
  action: MasterListTableAction,
): IMasterListState => {
  const { type, payload } = action;
  switch (type) {
    case MasterListTableActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case MasterListTableActionKind.DONE:
      return {
        ...state,
        loading: false,
      };
    case MasterListTableActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
          _start: 0,
        },
        page: 1,
      };
    case MasterListTableActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 20,
        },
      };

    case MasterListTableActionKind.CHANGE_LIMIT:
      return {
        ...state,
        query: { ...state.query, _limit: payload },
      };

    case MasterListTableActionKind.OPEN_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    case MasterListTableActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };

    case MasterListTableActionKind.GET_ROOM: {
      return {
        ...state,
        roomLoading: false,
        list: { ...state.list, room: payload },
      };
    }
    case MasterListTableActionKind.GET_MASTER: {
      return {
        ...state,
        channelLoading: false,
        list: { ...state.list, masters: payload },
      };
    }
    case MasterListTableActionKind.GET_FEED: {
      return {
        ...state,
        loading: false,
        list: { ...state.list, feed: payload },
      };
    }

    case MasterListTableActionKind.CHANGE_MASTER: {
      return {
        ...state,
        query: {
          ...state.query,
          master: payload,
        },
      };
    }
    case MasterListTableActionKind.CHANGE_ROOM: {
      return {
        ...state,
        query: {
          ...state.query,
          'master_room.id': payload,
        },
      };
    }
    case MasterListTableActionKind.CHANGE_SORT: {
      return {
        ...state,
        query: {
          ...state.query,
          _sort: payload,
        },
      };
    }
    case MasterListTableActionKind.SELECT_FEED: {
      return {
        ...state,
        selected: payload,
      };
    }
    case MasterListTableActionKind.GET_FEED_LENGTH: {
      return {
        ...state,
        list: { ...state.list, feedLength: payload },
      };
    }
  }
};

const MasterListTableContainer = () => {
  const [masterListState, dispatch] = useReducer(
    MasterListTableReducer,
    initialState,
  );

  const { user } = useAuth();
  const navigate = useNavigate();

  const getMasters = useCallback(async () => {
    try {
      const { data, status } = await APIMaster.getMasters(user.id);
      if (status === 200) {
        dispatch({
          type: MasterListTableActionKind.GET_MASTER,
          payload: data,
        });

        if (data.length >= 1) {
          dispatch({
            type: MasterListTableActionKind.CHANGE_MASTER,
            payload: data[0].id,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [user.id]);

  const getRooms = useCallback(async () => {
    try {
      const response = await APIMaster.getRoomsByMaster(
        masterListState.query.master,
      );
      dispatch({
        type: MasterListTableActionKind.GET_ROOM,
        payload: response.data,
      });

      if (response.data.length >= 1) {
        dispatch({
          type: MasterListTableActionKind.CHANGE_ROOM,
          payload: response.data[0].id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [masterListState.query.master]);

  const getFeeds = useCallback(async () => {
    dispatch({ type: MasterListTableActionKind.LOADING });

    try {
      const { data, status } = await APIMaster.getFeeds(
        masterListState.query,
        masterListState.query.master,
      );

      if (status === 200) {
        if (masterListState.query['master_room.id']) {
          dispatch({
            type: MasterListTableActionKind.GET_FEED,
            payload: data,
          });
        } else {
          dispatch({
            type: MasterListTableActionKind.GET_FEED,
            payload: [],
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({
        type: MasterListTableActionKind.DONE,
      });
    }
  }, [masterListState.query]);

  const getFeedLength = useCallback(async () => {
    try {
      const roomId = masterListState.query['master_room.id'];

      const { data, status } = await APIMaster.getFeedLength(
        masterListState.query.master,
        roomId,
      );
      if (status === 200) {
        dispatch({
          type: MasterListTableActionKind.GET_FEED_LENGTH,
          payload: data,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [masterListState.query]);

  const handleDelete = async () => {
    dispatch({ type: MasterListTableActionKind.LOADING });
    try {
      const { status } = await APIMaster.deleteFeed(
        masterListState.selected,
      );
      if (status === 200) {
        dispatch({
          type: MasterListTableActionKind.CLOSE_DELETE_DIALOG,
        });
        getFeeds();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFeeds();
  }, [getFeeds]);

  useEffect(() => {
    getMasters();
  }, [getMasters]);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  useEffect(() => {
    getFeedLength();
  }, [getFeedLength]);

  useEffect(() => {
    if (user && !user.masters[0]?.id) {
      navigate('/dashboard');
      toast.error('달인을 먼저 생성해주세요');
    }
  }, [user, navigate]);

  return (
    <MasterListTablePresenter
      masterListState={masterListState}
      dispatch={dispatch}
      handleDelete={handleDelete}
    />
  );
};

export default MasterListTableContainer;
