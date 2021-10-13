import { AxiosError } from 'axios';
import { useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { cmsServer } from 'src/lib/axios';
import { Channel, Room } from 'src/types/expert';
import MasterRoomPresenter from './MasterRoom.Presenter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';

export enum MasterRoomActionKind {
  LOADING = 'LOADING',
  GET_CHANNEL = 'GET_CHANNEL',
  GET_ROOM = 'GET_ROOM',
  CHANGE_ROOM = 'CHANGE_ROOM',
  IS_ORDER = 'IS_ORDER',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_TYPE = 'CHANGE_TYPE',
  CHANGE_CHANNEL = 'CHANGE_CHANNEL',
  SORT_CHANNEL = 'SORT_CHANNEL',
}

export interface MasterRoomAction {
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
  orderEdit: boolean;
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
        selectChannel: Number(payload[0].id) || '',
        sortChannel: Number(payload[0].id) || '',
        loading: false,
      };

    case MasterRoomActionKind.CHANGE_ROOM:
      return {
        ...state,
        master_room: payload,
        loading: false,
      };
    case MasterRoomActionKind.IS_ORDER:
      return {
        ...state,
        orderEdit: payload,
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
  orderEdit: false,
};
const MasterRoomContainer = () => {
  const { user } = useAuth();
  const [newState, dispatch] = useReducer(
    MasterRoomReducer,
    initialState,
  );

  const getChannel = async () => {
    dispatch({ type: MasterRoomActionKind.LOADING });
    try {
      const { status, data } = await cmsServer.get(
        `/master-channels?master.id=${user.id}`,
      );
      if (status === 200 && data.length > 0) {
        dispatch({
          type: MasterRoomActionKind.GET_CHANNEL,
          payload: data,
        });
        const response = await cmsServer.get(
          `/master-rooms?master_channel=${data[0].id}&isDeleted=0`,
        );
        dispatch({
          type: MasterRoomActionKind.GET_ROOM,
          payload: response.data,
        });
      } else {
        dispatch({
          type: MasterRoomActionKind.GET_CHANNEL,
          payload: [{ title: '없음' }],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChannel();
  }, []);

  //* 채널 변경 (방 목록)
  const handleChangeChannelSort = async (event) => {
    dispatch({ type: MasterRoomActionKind.LOADING });
    dispatch({
      type: MasterRoomActionKind.SORT_CHANNEL,
      payload: Number(event.target.value),
    });
    const { data } = await cmsServer.get(
      `/master-rooms?master_channel=${Number(
        event.target.value,
      )}&isDeleted=0`,
    );
    dispatch({
      type: MasterRoomActionKind.GET_ROOM,
      payload: data,
    });
  };

  //* 방 생성
  const createRoom = async () => {
    dispatch({ type: MasterRoomActionKind.LOADING });
    try {
      const response = await cmsServer.post(`/master-rooms`, {
        title: newState.title,
        master: user.id,
        master_channel: Number(newState.selectChannel),
        order:
          newState.master_channel.filter(
            (data) => data.id === Number(newState.selectChannel),
          )[0].master_rooms.length + 1,
        openType: newState.openType + '13',
      });
      toast.success('방이 추가되었습니다.');
      getChannel();
    } catch (error) {
      console.log(error);
    }
  };

  //* Drag * Drop
  const moveCard = async (
    dragIndex?: number,
    hoverIndex?: number,
  ) => {
    const dragCard = newState.master_room[dragIndex - 1];
    let card = [...newState.master_room];
    let cardSlice = card.splice(dragIndex - 1, 1);
    card.splice(hoverIndex - 1, 0, cardSlice[0]);
    console.log(card);
    dispatch({
      type: MasterRoomActionKind.GET_ROOM,
      payload: card,
    });
  };

  const handleOrderSave = async () => {
    try {
      const response = await Promise.all(
        newState.master_room.map(async (data, i) => {
          return await cmsServer.put(
            `/master-rooms/${data.id}?isDeleted=0`,
            {
              order: i + 1,
            },
          );
        }),
      );
      const { data } = await cmsServer.get(
        `/master-rooms?master_channel=${newState.sortChannel}&isDeleted=0`,
      );
      dispatch({
        type: MasterRoomActionKind.GET_ROOM,
        payload: data,
      });
      dispatch({
        type: MasterRoomActionKind.IS_ORDER,
        payload: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <MasterRoomPresenter
        newState={newState}
        moveCard={moveCard}
        handleChangeChannelSort={handleChangeChannelSort}
        createRoom={createRoom}
        getChannel={getChannel}
        handleOrderSave={handleOrderSave}
        dispatch={dispatch}
      />
    </DndProvider>
  );
};

export default MasterRoomContainer;
