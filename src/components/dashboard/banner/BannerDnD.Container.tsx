import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { Button, Card, Typography } from '@material-ui/core';
import { useRef } from 'react';
import {
  BannerListAction,
  BannerListActionKind,
} from './BannerList.Container';
import { IHR } from 'src/types/hiddenreport';

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
  dispatch: (param: BannerListAction) => void;
  newOrder: IHR[];
  nickname: string;
  title: string;
}

// React DND card component
const DraggableCard: React.FC<CardProps> = ({
  id,
  index,
  orderEdit,
  moveCard,
  img,
  newOrder,
  dispatch,
  nickname,
  title,
}) => {
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

  const deleteBanner = () => {
    let newData = newOrder;
    newData = newData.filter((data) => data.id !== id);
    dispatch({
      type: BannerListActionKind.CHANGE_NEWORDER,
      payload: newData,
    });
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
          <Typography variant="subtitle2" sx={{ my: 1 }}>
            제목 : {title}
          </Typography>
          <Typography variant="subtitle2">
            닉네임 : {nickname}
          </Typography>
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
