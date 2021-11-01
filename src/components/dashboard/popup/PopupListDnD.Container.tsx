import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { useReducer, useRef } from 'react';

// const style = {
//   cursor: 'move',
//   display: 'flex',
// };

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export interface CardProps {
  id: any;
  title: string;
  image: string;
  index: number;
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
  edit: true,
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
  image,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <div
      ref={ref}
      style={{
        opacity,
        width: '200px',
        height: '250px',
        border: orderEdit ? '2px solid #5664d2' : 'none',
        backgroundImage: `url(${image})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      data-handler-id={handlerId}
    ></div>
  );
};

export default DraggableCard;
