import { useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { cmsServer } from 'src/lib/axios';
import { IMaster, IMasterRoom } from 'src/types/master';
import MasterRoomPresenter from './MasterRoom.Presenter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export enum MasterRoomActionKind {
  LOADING = 'LOADING',
  GET_MASTER = 'GET_MASTER',
  GET_ROOM = 'GET_ROOM',
  CHANGE_ROOM = 'CHANGE_ROOM',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_TYPE = 'CHANGE_TYPE',
  SET_SELECT_MASTER = 'SET_SELECT_MASTER',
  IS_ORDER = 'IS_ORDER',
}

export interface MasterRoomAction {
  type: MasterRoomActionKind;
  payload?: any;
}

export interface MasterRoomState {
  selectMaster: IMaster;
  masters: IMaster[];
  rooms: IMasterRoom[];
  title: string;
  type: string;
  loading: boolean;
  edit: boolean;
  order: number;
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
    case MasterRoomActionKind.GET_MASTER:
      return {
        ...state,
        masters: payload,
        selectMaster: payload[0],
        loading: false,
      };

    case MasterRoomActionKind.IS_ORDER:
      return {
        ...state,
        orderEdit: payload,
      };
    case MasterRoomActionKind.CHANGE_ROOM:
      return {
        ...state,
        rooms: payload,
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
    case MasterRoomActionKind.SET_SELECT_MASTER:
      return {
        ...state,
        selectMaster: payload,
        rooms: payload.master_rooms,
      };
  }
};
const initialState: MasterRoomState = {
  selectMaster: null,
  masters: [],
  rooms: [],
  title: '',
  type: 'free',
  loading: false,
  edit: false,
  order: 0,
  orderEdit: false,
};
const MasterRoomContainer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [MasterRoomState, dispatch] = useReducer(
    MasterRoomReducer,
    initialState,
  );

  console.log('asdas', MasterRoomState);
  const { masters, selectMaster } = MasterRoomState;

  const getMasters = async () => {
    dispatch({ type: MasterRoomActionKind.LOADING });
    try {
      const { status, data } = await cmsServer.get(
        `/masters?user=${user.id}`,
      );
      if (status === 200 && data.length) {
        dispatch({
          type: MasterRoomActionKind.GET_MASTER,
          payload: data,
        });

        let _selectMaster = selectMaster
          ? data.filter((master) => master.id === selectMaster.id)[0]
          : data[0];

        _selectMaster.master_rooms =
          _selectMaster.master_rooms.filter(
            (room) => !room.isDeleted,
          );

        dispatch({
          type: MasterRoomActionKind.SET_SELECT_MASTER,
          payload: _selectMaster,
        });
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
    const selectMaster = masters.filter(
      (master) => master.id === Number(event.target.value),
    )[0];

    dispatch({
      type: MasterRoomActionKind.SET_SELECT_MASTER,
      payload: selectMaster,
    });
  };

  //* 방 생성
  const createRoom = async () => {
    try {
      if (!MasterRoomState.title) {
        toast.error('방 이름을 입력해주세요');
        return;
      }
      const { status } = await cmsServer.post(`/master-rooms`, {
        title: MasterRoomState.title,
        master: MasterRoomState.selectMaster,
        order: MasterRoomState.selectMaster.master_rooms.length + 1,
        type: MasterRoomState.type,
      });
      if (status === 200) {
        toast.success('방이 추가되었습니다.');

        dispatch({
          type: MasterRoomActionKind.CHANGE_TITLE,
          payload: '',
        });

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
    let card = [...MasterRoomState.rooms];
    let cardSlice = card.splice(dragIndex - 1, 1);
    card.splice(hoverIndex - 1, 0, cardSlice[0]);
    dispatch({
      type: MasterRoomActionKind.CHANGE_ROOM,
      payload: card,
    });
  };

  const handleOrderSave = async () => {
    try {
      await Promise.all(
        MasterRoomState.rooms.map(async (data, i) => {
          return await cmsServer.put(
            `/master-rooms/${data.id}?isDeleted=0`,
            {
              order: i + 1,
            },
          );
        }),
      );

      const { data } = await cmsServer.get(
        `/masters?user=${user.id}`,
      );

      const selected = data.filter(
        (master) => master.id === selectMaster.id,
      )[0];

      dispatch({
        type: MasterRoomActionKind.SET_SELECT_MASTER,
        payload: selected,
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

  useEffect(() => {
    if (user && !user.masters[0]?.id) {
      navigate('/dashboard');
      toast.error('달인을 먼저 생성해주세요');
    }
  }, [user, navigate]);

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
