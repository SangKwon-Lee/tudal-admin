import { useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { cmsServer } from 'src/lib/axios';
import {
  IMaster,
  IMasterChannel,
  IMasterRoom,
} from 'src/types/master';
import MasterRoomPresenter from './MasterRoom.Presenter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';

export enum MasterRoomActionKind {
  LOADING = 'LOADING',
  GET_MASTER = 'GET_MASTER',
  GET_ROOM = 'GET_ROOM',
  CHANGE_ROOM = 'CHANGE_ROOM',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_TYPE = 'CHANGE_TYPE',
  CHANGE_CHANNEL = 'CHANGE_CHANNEL',
  SORT_MASTER = 'SORT_MASTER',
  IS_ORDER = 'IS_ORDER',
}

export interface MasterRoomAction {
  type: MasterRoomActionKind;
  payload?: any;
}

export interface MasterRoomState {
  masters: IMaster[];
  master_room: IMasterRoom[];
  title: string;
  type: string;
  loading: boolean;
  edit: boolean;
  selectMaster: number | string;
  order: number;
  sortMaster: number | string;
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
    case MasterRoomActionKind.GET_MASTER:
      return {
        ...state,
        masters: payload,
        selectMaster: Number(payload[0].id),
        sortMaster: Number(payload[0].id),
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
        type: payload,
      };
    case MasterRoomActionKind.CHANGE_CHANNEL:
      return {
        ...state,
        selectMaster: payload,
      };
    case MasterRoomActionKind.SORT_MASTER:
      return {
        ...state,
        sortMaster: payload,
      };
  }
};
const initialState: MasterRoomState = {
  masters: [],
  master_room: [],
  title: '',
  type: 'free',
  loading: false,
  edit: false,
  order: 0,
  selectMaster: 0,
  sortMaster: 0,
  orderEdit: false,
};
const MasterRoomContainer = () => {
  const { user } = useAuth();
  const { master } = user;

  const [MasterRoomState, dispatch] = useReducer(
    MasterRoomReducer,
    initialState,
  );

  const getMasters = async () => {
    dispatch({ type: MasterRoomActionKind.LOADING });
    try {
      const { status, data } = await cmsServer.get(
        `/masters?user=${user.id}`,
      );
      if (status === 200 && data.length > 0) {
        dispatch({
          type: MasterRoomActionKind.GET_MASTER,
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
          type: MasterRoomActionKind.GET_MASTER,
          payload: [{ name: '없음', id: 0 }],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMasters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* 달인 변경 (방 목록)
  const handleChangeMasterSort = async (event) => {
    dispatch({ type: MasterRoomActionKind.LOADING });
    dispatch({
      type: MasterRoomActionKind.SORT_MASTER,
      payload: Number(event.target.value),
    });
    const { data } = await cmsServer.get(
      `/master-rooms?master=${Number(
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
      const { status } = await cmsServer.post(`/master-rooms`, {
        title: MasterRoomState.title,
        master: MasterRoomState.selectMaster,
        order: MasterRoomState.master_room.length + 1,
        type: MasterRoomState.type,
      });
      if (status === 200) {
        toast.success('방이 추가되었습니다.');
        getMasters();
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
        `/master-rooms?master_channel=${MasterRoomState.sortMaster}&isDeleted=0`,
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
        handleChangeMasterSort={handleChangeMasterSort}
        createRoom={createRoom}
        getMasters={getMasters}
        handleOrderSave={handleOrderSave}
        handleOrderCancle={handleOrderCancle}
        dispatch={dispatch}
      />
    </DndProvider>
  );
};

export default MasterRoomContainer;
