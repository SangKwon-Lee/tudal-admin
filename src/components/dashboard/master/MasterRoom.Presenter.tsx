import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { FC } from 'react';
import PlusIcon from '../../../icons/Plus';
import MinusIcon from '../../../icons/Minus';
import {
  MasterRoomAction,
  MasterRoomActionKind,
  MasterRoomState,
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

interface IMasterRoomProps {
  MasterRoomState: MasterRoomState;
  handleChangeChannelSort: (e: any) => void;
  createRoom: () => void;
  moveCard: any;
  getChannel: () => void;
  dispatch: (params: MasterRoomAction) => void;
  handleOrderSave: () => void;
  handleOrderCancle: () => void;
}

const MasterRoomPresenter: FC<IMasterRoomProps> = (props) => {
  const {
    MasterRoomState,
    moveCard,
    createRoom,
    handleChangeChannelSort,
    getChannel,
    handleOrderSave,
    handleOrderCancle,
    dispatch,
  } = props;
  const {
    master_room,
    master_channel,
    selectChannel,
    sortChannel,
    orderEdit,
    loading,
  } = MasterRoomState;
  return (
    <>
      {selectChannel !== 0 ? (
        <>
          <Card sx={{ p: 3, my: 4, width: '70%' }}>
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
                SelectProps={{
                  native: true,
                }}
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
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
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
              </TextField>
              {orderEdit ? (
                <Box>
                  <Button
                    color="primary"
                    sx={{ height: 40, mr: 1 }}
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                    onClick={handleOrderSave}
                  >
                    방 저장
                  </Button>
                  <Button
                    color="primary"
                    sx={{ height: 40 }}
                    startIcon={<MinusIcon fontSize="small" />}
                    variant="contained"
                    onClick={handleOrderCancle}
                  >
                    취소
                  </Button>
                </Box>
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
                        selectChannel={selectChannel}
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
                          selectChannel={selectChannel}
                        />
                      ))}
              </div>
            </Box>
          </Card>{' '}
        </>
      ) : (
        <Box>
          채널이 필요합니다. 채널 생성은 관리자에게 문의해주세요.
        </Box>
      )}
    </>
  );
};

export default MasterRoomPresenter;
