import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { AxiosError } from 'axios';
import { FC } from 'react';
import PlusIcon from '../../../icons/Plus';
import {
  MasterRoomAction,
  MasterRoomActionKind,
} from './MasterRoom.Container';
import DraggableCard from './MasterRoomDnD.Container';

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
  handleChangeChannelSort: (e: any) => void;
  createRoom: () => void;
  moveCard: any;
  getChannel: () => void;
  dispatch: (params: MasterRoomAction) => void;
  handleOrderSave: () => void;
}

const MasterRoomPresenter: FC<IMasterRoomProps> = (props) => {
  const {
    newState,
    moveCard,
    createRoom,
    handleChangeChannelSort,
    getChannel,
    handleOrderSave,
    dispatch,
  } = props;
  const {
    master_room,
    master_channel,
    selectChannel,
    sortChannel,
    orderEdit,
    loading,
  } = newState;
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
            onChange={(event) => {
              dispatch({
                type: MasterRoomActionKind.CHANGE_TITLE,
                payload: event.target.value,
              });
            }}
            name="title"
          />
          <TextField
            sx={{ width: 200, mr: 2 }}
            label="채널"
            onChange={(event) => {
              dispatch({
                type: MasterRoomActionKind.CHANGE_CHANNEL,
                payload: event.target.value,
              });
            }}
            value={selectChannel}
            name="channel"
            select
            placeholder="채널"
            variant="outlined"
            SelectProps={{ native: true }}
          >
            {master_channel &&
              master_channel.length > 0 &&
              master_channel.map((master, i) => (
                <option key={i} value={master.id}>
                  {master.name}
                </option>
              ))}
          </TextField>
          <TextField
            sx={{ width: 200 }}
            label="방 타입"
            onChange={(event) => {
              dispatch({
                type: MasterRoomActionKind.CHANGE_TYPE,
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
        </Box>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        {loading && <LinearProgress />}
        <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
          방 목록
        </Typography>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
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
            {master_channel &&
              master_channel.length > 0 &&
              master_channel.map((master, i) => (
                <option key={i} value={master.id}>
                  {master.name}
                </option>
              ))}
          </TextField>{' '}
          {orderEdit ? (
            <>
              <Button
                color="primary"
                sx={{ height: 40 }}
                startIcon={<PlusIcon fontSize="small" />}
                variant="contained"
                onClick={handleOrderSave}
              >
                방 저장
              </Button>
              <Button
                color="primary"
                sx={{ height: 40 }}
                startIcon={<PlusIcon fontSize="small" />}
                variant="contained"
                onClick={handleOrderSave}
              >
                취소
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              sx={{ height: 40 }}
              startIcon={<PlusIcon fontSize="small" />}
              onClick={() => {
                dispatch({
                  type: MasterRoomActionKind.IS_ORDER,
                  payload: true,
                });
              }}
              variant="contained"
            >
              방 순서 변경
            </Button>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          {orderEdit && (
            <Typography sx={{ my: 2 }}>
              방 순서는 Drag & Drop으로 변경 가능합니다.
            </Typography>
          )}
          <div
            style={{
              cursor: orderEdit ? 'move' : 'none',
              display: 'flex',
            }}
          >
            {orderEdit
              ? master_room.map((room, i) => (
                  <DraggableCard
                    key={i}
                    id={room.id}
                    title={room.title}
                    openType={room.openType}
                    index={i + 1}
                    orderEdit={orderEdit}
                    moveCard={moveCard}
                    getChannel={getChannel}
                  />
                ))
              : master_room
                  .sort((a, b) => a.order - b.order)
                  .map((room, i) => (
                    <DraggableCard
                      key={i}
                      id={room.id}
                      title={room.title}
                      openType={room.openType}
                      index={room.order}
                      orderEdit={orderEdit}
                      moveCard={moveCard}
                      getChannel={getChannel}
                    />
                  ))}
          </div>
        </Box>
      </Card>
    </>
  );
};

export default MasterRoomPresenter;
