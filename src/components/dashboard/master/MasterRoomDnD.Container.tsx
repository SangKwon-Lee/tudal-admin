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
    label: '프리미엄',
    value: 'premium',
  },
];

export interface CardProps {
  id: any;
  title: string;
  index: number;
  openType: string;
  getChannel: () => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  orderEdit: boolean;
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
  openType: string;
  isDeletedOpen: boolean;
}

const initialState: newState = {
  edit: false,
  openType: '',
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
  openType,
  getChannel,
}) => {
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
          title: title,
          openType: openType,
        };
      case MasterRoomDnDActionKind.CHANGE_TITLE:
        return {
          ...state,
          title: payload,
        };
      case MasterRoomDnDActionKind.CHANGE_TYPE:
        return {
          ...state,
          openType: payload,
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
  const [newState, dispatch] = useReducer(
    MasterRoomDnDReducer,
    initialState,
  );

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

  const handleEditRoom = async () => {
    try {
      const response = await cmsServer.put(`/master-rooms/${id}`, {
        title: newState.title,
        openType: newState.openType,
      });
      dispatch({ type: MasterRoomDnDActionKind.SAVE });
      getChannel();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const response = await cmsServer.put(`/master-rooms/${id}`, {
        isDeleted: true,
      });
      dispatch({ type: MasterRoomDnDActionKind.SAVE });
      dispatch({
        type: MasterRoomDnDActionKind.IS_DELETED_MODAL,
        payload: false,
      });
      getChannel();
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
        border: orderEdit ? '1px dotted white' : 'none',
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
              value={newState.openType}
              onChange={(event) => {
                dispatch({
                  type: MasterRoomDnDActionKind.CHANGE_TYPE,
                  payload: event.target.value,
                });
              }}
              name="openType"
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
            <Typography>타입 : {openType}</Typography>
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
                onClick={handleEditRoom}
                // eslint-disable-next-line react/jsx-no-undef
                // startIcon={<PlusIcon fontSize="small" />}
              >
                내용 저장
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
                onClick={() => {
                  dispatch({ type: MasterRoomDnDActionKind.EDIT });
                }}
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
