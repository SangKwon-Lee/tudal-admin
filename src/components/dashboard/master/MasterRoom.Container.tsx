import { AxiosError } from 'axios';
import { useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { cmsServer } from 'src/lib/axios';
import { Channel, Room } from 'src/types/master';
import MasterRoomPresenter from './MasterRoom.Presenter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

enum MasterRoomActionKind {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  GET_CHANNEL = 'GET_CHANNEL',
  GET_ROOM = 'GET_ROOM',
  CHANGE_ROOM = 'CHANGE_ROOM',
  RELOAD = 'RELOAD',
  EDIT = 'EDIT',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_TYPE = 'CHANGE_TYPE',
  CHANGE_CHANNEL = 'CHANGE_CHANNEL',
  SORT_CHANNEL = 'SORT_CHANNEL',
}

interface MasterRoomAction {
  type: MasterRoomActionKind;
  payload?: any;
}

interface newState {
  master_room: Room[];
  title: string;
  openType: string;
  loading: boolean;
  error: AxiosError<any> | null;
  edit: boolean;
  master_channel: Channel[];
  selectChannel: number | string;
  order: number;
  sortChannel: number | string;
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
    case MasterRoomActionKind.GET_CHANNEL:
      return {
        ...state,
        master_channel: payload,
        loading: false,
        selectChannel: Number(payload[0].id) || '',
        sortChannel: Number(payload[0].id) || '',
      };
    case MasterRoomActionKind.CHANGE_ROOM:
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
    case MasterRoomActionKind.CHANGE_CHANNEL:
      return {
        ...state,
        selectChannel: payload,
      };
    case MasterRoomActionKind.SORT_CHANNEL:
      return {
        ...state,
        sortChannel: payload,
      };
  }
};
const initialState: newState = {
  master_room: [],
  master_channel: [],
  title: '',
  openType: 'free',
  loading: false,
  error: null,
  edit: false,
  order: 0,
  selectChannel: '',
  sortChannel: '',
};
const MasterRoomContainer = () => {
  const { user } = useAuth();
  const [newState, dispatch] = useReducer(
    MasterRoomReducer,
    initialState,
  );

  const getChannel = async () => {
    try {
      const { status, data } = await cmsServer.get(
        `/master-channels?master.id=${user.id}`,
      );
      if (status === 200 && data.length > 0) {
        dispatch({
          type: MasterRoomActionKind.GET_CHANNEL,
          payload: data,
        });
      } else {
        dispatch({
          type: MasterRoomActionKind.GET_CHANNEL,
          payload: [{ title: '없음' }],
        });
      }
    } catch (error) {
      dispatch({
        type: MasterRoomActionKind.ERROR,
        payload: error,
      });
    }
  };

  const getRoom = async () => {
    const { data } = await cmsServer.get(
      `/master-rooms?master.id=${user.id}`,
    );
    dispatch({
      type: MasterRoomActionKind.GET_ROOM,
      payload: data,
    });
  };

  useEffect(() => {
    getChannel();
    getRoom();
  }, []);

  //* 방 이름 변경
  const changeRoomInput = (event) => {
    dispatch({
      type: MasterRoomActionKind.CHANGE_TITLE,
      payload: event.target.value,
    });
  };
  //* 방 타입 변경
  const changeTypeInput = (event) => {
    dispatch({
      type: MasterRoomActionKind.CHANGE_TYPE,
      payload: event.target.value,
    });
  };

  //* 채널 변경 (방 만들 때 )
  const handleChangeChannel = (event) => {
    dispatch({
      type: MasterRoomActionKind.CHANGE_CHANNEL,
      payload: event.target.value,
    });
  };

  //* 채널 변경 (방 목록)
  const handleChangeChannelSort = (event) => {
    dispatch({
      type: MasterRoomActionKind.SORT_CHANNEL,
      payload: Number(event.target.value),
    });
  };

  //* 채널 변경시 방 목록 변경
  useEffect(() => {
    let roomFilter = newState.master_channel.filter(
      (data) => data.id === newState.sortChannel,
    );
    if (roomFilter[0]) {
      dispatch({
        type: MasterRoomActionKind.CHANGE_ROOM,
        payload: roomFilter[0].master_rooms,
      });
    }
  }, [newState.sortChannel, newState.master_room]);

  const createRoom = async () => {
    try {
      const response = await cmsServer.post(`/master-rooms`, {
        title: newState.title,
        master: user.id,
        master_channel: Number(newState.selectChannel),
        order:
          newState.master_channel.filter(
            (data) => data.id === Number(newState.selectChannel),
          )[0].master_rooms.length + 1,
        openType: newState.openType + 'as#',
      });
      getChannel();
      getRoom();
    } catch (error) {
      dispatch({
        type: MasterRoomActionKind.ERROR,
        payload: error,
      });
    }
  };

  const moveCard = async (dragIndex: number, hoverIndex: number) => {
    console.log('drag, hover', dragIndex, hoverIndex);
    const dragCard = newState.master_room[dragIndex - 1];
    console.log(dragCard, 'drag');
    let card = [...newState.master_room];
    let cardSlice = card.splice(dragIndex - 1, 1);
    card.splice(hoverIndex - 1, 0, cardSlice[0]);
    try {
      const response = await Promise.all(
        card.map(async (data, i) => {
          return await cmsServer.put(`/master-rooms/${data.id}`, {
            order: i + 1,
          });
        }),
      );
      getChannel();
      // getRoom();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <MasterRoomPresenter
        newState={newState}
        moveCard={moveCard}
        changeRoomInput={changeRoomInput}
        changeTypeInput={changeTypeInput}
        handleChangeChannel={handleChangeChannel}
        handleChangeChannelSort={handleChangeChannelSort}
        createRoom={createRoom}
      />
    </DndProvider>
  );
};

export default MasterRoomContainer;
