import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import ConfirmModal from '../../widgets/modals/ConfirmModal';
import { XYCoord } from 'dnd-core';
import {
  Box,
  Button,
  Card,
  Dialog,
  TextField,
  Typography,
} from '@material-ui/core';
import { useReducer, useRef } from 'react';
import { cmsServer } from 'src/lib/axios';
import toast from 'react-hot-toast';
import useAuth from 'src/hooks/useAuth';

const style = {
  cursor: 'move',
  display: 'flex',
};
interface DragItem {
  index: number;
  id: string;
  type: string;
}
const roomType = [
  {
    label: '무료',
    value: 'free',
  },
  {
    label: '유료',
    value: 'paid',
  },
];

export interface CardProps {
  id: any;
  title: string;
  index: number;
  type: string;
  getMasters: () => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  orderEdit: boolean;
  selectMaster: any;
}

enum MasterRoomDnDActionKind {
  EDIT = 'EDIT',
  SAVE = 'SAVE',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_TYPE = 'CHANGE_TYPE',
  DELETE_ROOM = 'DELETE_ROOM',
  IS_DELETED_MODAL = 'IS_DELETED_MODAL',
}

interface MasterRommDnDAction {
  type: MasterRoomDnDActionKind;
  payload?: any;
}
interface newState {
  edit: boolean;
  title: string;
  type: string;
  isDeletedOpen: boolean;
}

const MasterRoomDnDReducer = (
  state: newState,
  action: MasterRommDnDAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case MasterRoomDnDActionKind.EDIT:
      return {
        ...state,
        edit: true,
      };
    case MasterRoomDnDActionKind.CHANGE_TITLE:
      return {
        ...state,
        title: payload,
      };
    case MasterRoomDnDActionKind.CHANGE_TYPE:
      return {
        ...state,
        type: payload,
      };
    case MasterRoomDnDActionKind.SAVE:
      return {
        ...state,
        edit: false,
      };
    case MasterRoomDnDActionKind.IS_DELETED_MODAL:
      return {
        ...state,
        isDeletedOpen: payload,
      };
  }
};

const initialState: newState = {
  edit: false,
  type: '',
  title: '',
  isDeletedOpen: false,
};

// React DND card component
const DraggableCard: React.FC<CardProps> = ({
  id,
  title,
  index,
  orderEdit,
  moveCard,
  type,
  getMasters,
  selectMaster,
}) => {
  const [newState, dispatch] = useReducer(
    MasterRoomDnDReducer,
    initialState,
  );
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',

    // drop된 item의 id를 가져온다
    collect(monitor) {
      return { handlerId: monitor.getHandlerId() };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.left - hoverBoundingRect.right) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY =
        (clientOffset as XYCoord).x - hoverBoundingRect.right;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  //* 방 내용 수정 클릭
  const hadnleEditRoom = () => {
    dispatch({ type: MasterRoomDnDActionKind.EDIT });
    dispatch({
      type: MasterRoomDnDActionKind.CHANGE_TITLE,
      payload: title,
    });
    dispatch({
      type: MasterRoomDnDActionKind.CHANGE_TYPE,
      payload: type,
    });
  };

  //* 방 내용 수정 저장
  const handleSaveRoom = async () => {
    try {
      const { status, data } = await cmsServer.get(
        `/master-rooms?master.id=${user.id}`,
      );

      if (status === 200) {
        if (
          data.filter((data) => data.title !== newState.title)
            .length !== data.length
        ) {
          toast.error('중복된 이름으로 수정할 수 없습니다.');
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const { status } = await cmsServer.put(`/master-rooms/${id}`, {
        title: newState.title,
        type: newState.type,
      });
      if (status === 200) {
        toast.success('저장했습니다.');
        dispatch({ type: MasterRoomDnDActionKind.SAVE });
        getMasters();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 방 삭제
  const handleDeleteRoom = async () => {
    try {
      const { status } = await cmsServer.put(`/master-rooms/${id}`, {
        isDeleted: true,
      });
      if (status === 200) {
        toast.success('삭제했습니다.');
        dispatch({ type: MasterRoomDnDActionKind.SAVE });
        dispatch({
          type: MasterRoomDnDActionKind.IS_DELETED_MODAL,
          payload: false,
        });
        getMasters();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card
      sx={{
        m: 1,
        p: 1,
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: orderEdit ? '2px solid #5664d2' : 'none',
      }}
    >
      <div
        ref={ref}
        style={{ ...style, opacity }}
        data-handler-id={handlerId}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {newState.edit ? (
            <TextField
              sx={{ width: '130px' }}
              label="방 이름"
              placeholder="방 이름"
              variant="outlined"
              value={newState.title}
              onChange={(event) => {
                dispatch({
                  type: MasterRoomDnDActionKind.CHANGE_TITLE,
                  payload: event.target.value,
                });
              }}
              name="title"
            />
          ) : (
            <Typography sx={{ my: 1 }}>이름 : {title}</Typography>
          )}
          {newState.edit ? (
            <TextField
              sx={{ width: '130px', mt: 2 }}
              label="방 타입"
              value={newState.type}
              onChange={(event) => {
                dispatch({
                  type: MasterRoomDnDActionKind.CHANGE_TYPE,
                  payload: event.target.value,
                });
              }}
              name="type"
              select
              placeholder="방 타입"
              variant="outlined"
              SelectProps={{ native: true }}
            >
              {roomType.map((room) => (
                <option key={room.label} value={room.value}>
                  {room.label}
                </option>
              ))}
            </TextField>
          ) : (
            <Typography>
              타입 : {type === 'free' ? '무료' : '유료'}
            </Typography>
          )}
          {newState.edit ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                color="primary"
                sx={{
                  height: 35,
                  width: 120,
                  mt: 1,
                }}
                onClick={handleSaveRoom}
              >
                내용 저장
              </Button>
              <Button
                color="primary"
                sx={{
                  height: 35,
                  width: 120,
                  mt: 1,
                }}
                onClick={() => {
                  dispatch({ type: MasterRoomDnDActionKind.SAVE });
                  toast.success('취소했습니다.');
                }}
              >
                취소
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'end',
                alignItems: 'center',
              }}
            >
              <Button
                color="primary"
                sx={{
                  height: 35,
                  width: 120,
                  mt: 1,
                }}
                onClick={hadnleEditRoom}
              >
                방 수정
              </Button>
              <Button
                color="primary"
                sx={{
                  height: 35,
                  width: 120,
                  mt: 1,
                }}
                onClick={() => {
                  dispatch({
                    type: MasterRoomDnDActionKind.IS_DELETED_MODAL,
                    payload: true,
                  });
                }}
              >
                방 삭제
              </Button>
            </Box>
          )}
        </Box>
      </div>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={newState.isDeletedOpen}
        onClose={() => {
          dispatch({
            type: MasterRoomDnDActionKind.IS_DELETED_MODAL,
            payload: false,
          });
        }}
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={'삭제시 큰 주의가 필요합니다.'}
          confirmTitle={'삭제'}
          handleOnClick={handleDeleteRoom}
          handleOnCancel={() => {
            dispatch({
              type: MasterRoomDnDActionKind.IS_DELETED_MODAL,
              payload: false,
            });
          }}
        />
      </Dialog>
    </Card>
  );
};

export default DraggableCard;
