import axios, { AxiosError } from 'axios';
import { useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { cmsServer } from 'src/lib/axios';
import { Room } from 'src/types/expert';
import MasterRoomPresenter from './MasterRoom.Presenter';

enum MasterRoomActionKind {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  GET_ROOM = 'GET_ROOM',
  RELOAD = 'RELOAD',
  EDIT = 'EDIT',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_TYPE = 'CHANGE_TYPE',
}

interface MasterRoomAction {
  type: MasterRoomActionKind;
  payload?: any;
}

interface newState {
  master_room: Room;
  title: string;
  openType: string;
  loading: boolean;
  error: AxiosError<any> | null;
  edit: boolean;
}

const MasterRoomReducer = (
  state: newState,
  action: MasterRoomAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case MasterRoomActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case MasterRoomActionKind.GET_ROOM:
      return {
        ...state,
        master_room: payload,
        loading: false,
      };
    case MasterRoomActionKind.RELOAD:
      return {
        ...state,
        master_room: payload,
        loading: false,
      };
    case MasterRoomActionKind.EDIT:
      return {
        ...state,
        edit: true,
      };
    case MasterRoomActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
    case MasterRoomActionKind.CHANGE_TITLE:
      return {
        ...state,
        title: payload,
      };
    case MasterRoomActionKind.CHANGE_TYPE:
      return {
        ...state,
        openType: payload,
      };
  }
};
const initialState: newState = {
  master_room: {
    id: 0,
    title: '',
    openType: '',
    order: 0,
  },
  title: '',
  openType: 'free',
  loading: false,
  error: null,
  edit: false,
};
const MasterRoomContainer = () => {
  const { user } = useAuth();
  const [newState, dispatch] = useReducer(
    MasterRoomReducer,
    initialState,
  );
  console.log(newState.master_room);

  useEffect(() => {
    getRoom();
  }, []);

  const getRoom = async () => {
    const { data } = await cmsServer.get(`/master-rooms?master.id=8`);
    console.log(data);
    dispatch({
      type: MasterRoomActionKind.GET_ROOM,
      payload: data,
    });
  };

  const changeRoomInput = (event) => {
    dispatch({
      type: MasterRoomActionKind.CHANGE_TITLE,
      payload: event.target.value,
    });
  };

  const createRoom = () => {};

  return (
    <MasterRoomPresenter
      newState={newState}
      changeRoomInput={changeRoomInput}
    />
  );
};

export default MasterRoomContainer;
