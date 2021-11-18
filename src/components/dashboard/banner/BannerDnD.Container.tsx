import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import ConfirmModal from '../../widgets/modals/ConfirmModal';
import { XYCoord } from 'dnd-core';
import { Box, Button, Card } from '@material-ui/core';
import { useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import useAuth from 'src/hooks/useAuth';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export interface CardProps {
  id: any;
  index: number;
  moveCard?: (dragIndex: number, hoverIndex: number) => void;
  orderEdit?: boolean;
  img: string;
}

enum BannerDnDActionKind {
  EDIT = 'EDIT',
  SAVE = 'SAVE',
  IS_DELETED_MODAL = 'IS_DELETED_MODAL',
}

interface BannerDnDAction {
  type: BannerDnDActionKind;
  payload?: any;
}
interface newState {
  edit: boolean;
  isDeletedOpen: boolean;
}

const BannerDnDReducer = (
  state: newState,
  action: BannerDnDAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case BannerDnDActionKind.EDIT:
      return {
        ...state,
        edit: true,
      };
    case BannerDnDActionKind.SAVE:
      return {
        ...state,
        edit: false,
      };
    case BannerDnDActionKind.IS_DELETED_MODAL:
      return {
        ...state,
        isDeletedOpen: payload,
      };
  }
};

const initialState: newState = {
  edit: false,
  isDeletedOpen: false,
};

// React DND card component
const DraggableCard: React.FC<CardProps> = ({
  id,
  index,
  orderEdit,
  moveCard,
  img,
}) => {
  const [newState, dispatch] = useReducer(
    BannerDnDReducer,
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

  const deleteBanner = async () => {
    console.log(id);
  };

  return (
    <>
      <Card
        sx={{
          m: 1,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: orderEdit ? '2px solid #5664d2' : 'none',
        }}
      >
        <div
          ref={ref}
          style={{
            opacity,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          data-handler-id={handlerId}
        >
          <img
            src={img}
            alt="img"
            style={{
              width: '200px',
              height: '200px',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            data-handler-id={handlerId}
          ></img>
          {orderEdit && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ my: 1, width: '100px' }}
              onClick={deleteBanner}
            >
              내리기
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};

export default DraggableCard;
