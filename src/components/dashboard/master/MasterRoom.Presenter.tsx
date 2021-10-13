import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Typography,
} from '@material-ui/core';
import { AxiosError } from 'axios';
import { FC, useRef } from 'react';
import PlusIcon from '../../../icons/Plus';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
const style = {
  cursor: 'move',
  display: 'flex',
};
interface DragItem {
  index: number;
  id: string;
  type: string;
}

export interface CardProps {
  id: any;
  title: string;
  index: number;
  openType: string;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

// React DND card component
export const DraggableCard: React.FC<CardProps> = ({
  id,
  title,
  index,
  moveCard,
  openType,
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

  return (
    <Card sx={{ m: 2, p: 2 }}>
      <div
        ref={ref}
        style={{ ...style, opacity }}
        data-handler-id={handlerId}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ my: 1 }}>이름 : {title}</Typography>
          <Typography>타입 : {openType}</Typography>
        </Box>
      </div>
    </Card>
  );
};

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

interface newState {
  room: any;
  loading: boolean;
  error: AxiosError<any> | null;
}

interface IMasterRoomProps {
  newState: any;
  changeRoomInput: (e: any) => void;
  changeTypeInput: (e: any) => void;
  handleChangeChannel: (e: any) => void;
  handleChangeChannelSort: (e: any) => void;
  createRoom: () => void;
  moveCard: any;
}

const MasterRoomPresenter: FC<IMasterRoomProps> = (props) => {
  const {
    newState,
    changeRoomInput,
    moveCard,
    changeTypeInput,
    createRoom,
    handleChangeChannel,
    handleChangeChannelSort,
  } = props;
  const { master_room, master_channel, selectChannel, sortChannel } =
    newState;
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
            방 만들기
          </Typography>
          <Button
            color="primary"
            // eslint-disable-next-line react/jsx-no-undef
            startIcon={<PlusIcon fontSize="small" />}
            sx={{ mb: 3 }}
            onClick={createRoom}
            variant="contained"
          >
            방 추가
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box>
          <TextField
            sx={{ mr: 2 }}
            label="방 이름"
            placeholder="방 이름"
            variant="outlined"
            onChange={changeRoomInput}
            name="title"
          />
          <TextField
            sx={{ width: 200, mr: 2 }}
            label="채널"
            onChange={handleChangeChannel}
            value={selectChannel}
            name="channel"
            select
            placeholder="채널"
            variant="outlined"
            SelectProps={{ native: true }}
          >
            {master_channel.length > 0 &&
              master_channel.map((master, i) => (
                <option key={i} value={master.id}>
                  {master.name}
                </option>
              ))}
          </TextField>
          <TextField
            sx={{ width: 200 }}
            label="방 타입"
            onChange={changeTypeInput}
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
        </Box>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
          방 목록
        </Typography>
        <TextField
          sx={{ width: 200, my: 2 }}
          label="채널"
          onChange={handleChangeChannelSort}
          value={sortChannel}
          name="channel"
          select
          placeholder="채널"
          variant="outlined"
          SelectProps={{ native: true }}
        >
          {master_channel.length > 0 &&
            master_channel.map((master, i) => (
              <option key={i} value={master.id}>
                {master.name}
              </option>
            ))}
        </TextField>
        <Divider sx={{ my: 2 }} />
        <div style={style}>
          {master_room
            .sort((a, b) => a.order - b.order)
            .map((room, i) => (
              <DraggableCard
                key={i}
                id={room.id}
                title={room.title}
                openType={room.openType}
                index={room.order}
                moveCard={moveCard}
              />
            ))}
        </div>
      </Card>
    </>
  );
};

export default MasterRoomPresenter;
