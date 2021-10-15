import { useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { cmsServer } from 'src/lib/axios';
import { Channel, Room } from 'src/types/master';
import MasterRoomPresenter from './MasterRoom.Presenter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';

export enum MasterRoomActionKind {
  LOADING = 'LOADING',
  GET_CHANNEL = 'GET_CHANNEL',
  GET_ROOM = 'GET_ROOM',
  CHANGE_ROOM = 'CHANGE_ROOM',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_TYPE = 'CHANGE_TYPE',
  CHANGE_CHANNEL = 'CHANGE_CHANNEL',
  SORT_CHANNEL = 'SORT_CHANNEL',
  IS_ORDER = 'IS_ORDER',
}

export interface MasterRoomAction {
  type: MasterRoomActionKind;
  payload?: any;
}

export interface MasterRoomState {
  master_room: Room[];
  title: string;
  openType: string;
  loading: boolean;
  edit: boolean;
  master_channel: Channel[];
  selectChannel: number | string;
  order: number;
  sortChannel: number | string;
  orderEdit: boolean;
}

const MasterRoomReducer = (
  state: MasterRoomState,
  action: MasterRoomAction,
): MasterRoomState => {
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
const initialState: MasterRoomState = {
  master_room: [],
  master_channel: [],
  title: '',
  openType: 'free',
  loading: false,
  edit: false,
  order: 0,
  selectChannel: '',
  sortChannel: '',
  orderEdit: false,
};
const MasterRoomContainer = () => {
  const { user } = useAuth();
  const [MasterRoomState, dispatch] = useReducer(
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
        if (data[0].master_rooms) {
          const roomData = data[0].master_rooms.filter(
            (data) => data.isDeleted === false,
          );
          dispatch({
            type: MasterRoomActionKind.GET_ROOM,
            payload: roomData,
          });
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    try {
      const { status, data } = await cmsServer.get(
        `/master-rooms?master.id=${user.id}&master_channel=${MasterRoomState.selectChannel}`,
      );
      console.log(data.length);
      console.log(
        data.filter((data) => data.title === MasterRoomState.title)
          .length,
      );

      if (status === 200) {
        if (
          data.filter((data) => data.title !== MasterRoomState.title)
            .length !== data.length
        ) {
          toast.error('중복된 이름으로 추가할 수 없습니다.');
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const { status } = await cmsServer.post(`/master-rooms`, {
        title: MasterRoomState.title,
        master: user.id,
        master_channel: Number(MasterRoomState.selectChannel),
        order: MasterRoomState.master_room.length + 1,
        openType: MasterRoomState.openType,
      });
      if (status === 200) {
        toast.success('방이 추가되었습니다.');
        getChannel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* Drag * Drop
  const moveCard = async (
    dragIndex?: number,
    hoverIndex?: number,
  ) => {
    // const dragCard = MasterRoomState.master_room[dragIndex - 1];
    let card = [...MasterRoomState.master_room];
    let cardSlice = card.splice(dragIndex - 1, 1);
    card.splice(hoverIndex - 1, 0, cardSlice[0]);
    dispatch({
      type: MasterRoomActionKind.GET_ROOM,
      payload: card,
    });
  };

  const handleOrderSave = async () => {
    try {
      await Promise.all(
        MasterRoomState.master_room.map(async (data, i) => {
          return await cmsServer.put(
            `/master-rooms/${data.id}?isDeleted=0`,
            {
              order: i + 1,
            },
          );
        }),
      );
      const { data } = await cmsServer.get(
        `/master-rooms?master_channel=${MasterRoomState.sortChannel}&isDeleted=0`,
      );
      dispatch({
        type: MasterRoomActionKind.GET_ROOM,
        payload: data,
      });
      dispatch({
        type: MasterRoomActionKind.IS_ORDER,
        payload: false,
      });
      toast.success('저장했습니다.');
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrderCancle = () => {
    dispatch({
      type: MasterRoomActionKind.IS_ORDER,
      payload: false,
    });
    toast.success('취소했습니다.');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <MasterRoomPresenter
        MasterRoomState={MasterRoomState}
        moveCard={moveCard}
        handleChangeChannelSort={handleChangeChannelSort}
        createRoom={createRoom}
        getChannel={getChannel}
        handleOrderSave={handleOrderSave}
        handleOrderCancle={handleOrderCancle}
        dispatch={dispatch}
      />
    </DndProvider>
  );
};

export default MasterRoomContainer;
