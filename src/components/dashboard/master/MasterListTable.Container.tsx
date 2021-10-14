import { useCallback, useEffect, useReducer } from 'react';
import { APIMaster } from 'src/lib/api';
import MasterListTablePresenter from './MasterListTable.Presenter';
import useAuth from 'src/hooks/useAuth';
import {
  IMasterChannel,
  IMasterFeed,
  IMasterRoom,
} from 'src/types/master';

export enum MasterListTableActionKind {
  // loading
  LOADING = 'LOADING',
  CHANNEL_LOADING = 'CHANNEL_LOADING',
  ROOM_LOADING = 'ROOM_LOADING',

  // Load APIS
  GET_CHANNEL = 'GET_CHANNEL',
  GET_ROOM = 'GET_ROOM',
  GET_FEED = 'GET_FEED',
  GET_FEED_LENGTH = 'GET_FEED_LENGTH',

  // changes
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

export interface MasterListTableAction {
  type: MasterListTableActionKind;
  payload?: any;
}

export interface IMasterListState {
  loading: boolean;
  channelLoading: boolean;
  roomLoading: boolean;

  page: number;
  selected: number;
  list: {
    feed: IMasterFeed[];
    feedLength: number;
    channel: IMasterChannel[];
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
    isDeleted: boolean;
    'master_room.id': number;
    'master_room.master_channel.id': number;
  };
}

const initialState: IMasterListState = {
  list: { feed: [], feedLength: 0, channel: [], room: [] },
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
    isDeleted: false,
    'master_room.id': null,
    'master_room.master_channel.id': null,
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
    case MasterListTableActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
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
    case MasterListTableActionKind.GET_CHANNEL: {
      return {
        ...state,
        channelLoading: false,
        list: { ...state.list, channel: payload },
      };
    }
    case MasterListTableActionKind.GET_FEED: {
      return {
        ...state,
        loading: false,
        list: { ...state.list, feed: payload },
      };
    }

    case MasterListTableActionKind.CHANGE_CHANNEL: {
      return {
        ...state,
        query: {
          ...state.query,
          'master_room.master_channel.id': payload,
          'master_room.id': null,
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

  const getChannels = useCallback(async () => {
    try {
      const { data, status } = await APIMaster.getChannels(user.id);
      if (status === 200) {
        dispatch({
          type: MasterListTableActionKind.GET_CHANNEL,
          payload: data,
        });

        if (data.length >= 1) {
          dispatch({
            type: MasterListTableActionKind.CHANGE_CHANNEL,
            payload: data[0].id,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  const getRooms = useCallback(async () => {
    try {
      const channelId =
        masterListState.query['master_room.master_channel.id'];

      const response = await APIMaster.getRooms(user.id, channelId);
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
  }, [user, masterListState.query['master_room.master_channel.id']]);

  const getFeeds = useCallback(async () => {
    dispatch({ type: MasterListTableActionKind.LOADING });

    try {
      const { data, status } = await APIMaster.getFeeds(
        masterListState.query,
        user.id,
      );

      if (status === 200) {
        dispatch({
          type: MasterListTableActionKind.GET_FEED,
          payload: data,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [masterListState.query, user]);

  const getFeedLength = useCallback(async () => {
    try {
      const roomId = masterListState.query['master_room.id'];

      const { data, status } = await APIMaster.getFeedLength(
        user.id,
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
  }, [user, masterListState.query['master_room.id']]);

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
    getChannels();
  }, [getChannels]);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  useEffect(() => {
    getFeedLength();
  }, [getFeedLength]);

  return (
    <MasterListTablePresenter
      newState={masterListState}
      dispatch={dispatch}
      handleDelete={handleDelete}
    />
  );
};

export default MasterListTableContainer;
