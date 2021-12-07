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
    label: '유료',
    value: 'paid',
  },
];

interface IMasterRoomProps {
  MasterRoomState: MasterRoomState;
  handleChangeMasterSort: (e: any) => void;
  createRoom: () => void;
  moveCard: any;
  getMasters: () => void;
  dispatch: (params: MasterRoomAction) => void;
  handleOrderSave: () => void;
  handleOrderCancle: () => void;
}

const MasterRoomPresenter: FC<IMasterRoomProps> = (props) => {
  const {
    MasterRoomState,
    moveCard,
    createRoom,
    handleChangeMasterSort,
    getMasters,
    handleOrderSave,
    handleOrderCancle,
    dispatch,
  } = props;
  const {
    master_room,
    masters,
    selectMaster,
    sortMaster,
    orderEdit,
    loading,
  } = MasterRoomState;
  return (
    <>
      {selectMaster !== 0 ? (
        <>
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
                label="달인"
                onChange={handleChangeMasterSort}
                value={sortMaster}
                name="channel"
                select
                placeholder="달인"
                variant="outlined"
                SelectProps={{ native: true }}
              >
                {masters &&
                  masters.length > 0 &&
                  masters.map((master, i) => (
                    <option key={i} value={master.id}>
                      {master.nickname}
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
                        type={room.type}
                        index={i + 1}
                        orderEdit={orderEdit}
                        moveCard={moveCard}
                        getMasters={getMasters}
                        selectMaster={selectMaster}
                      />
                    ))
                  : master_room
                      .sort((a, b) => a.order - b.order)
                      .map((room, i) => (
                        <DraggableCard
                          key={i}
                          id={room.id}
                          title={room.title}
                          type={room.type}
                          index={room.order}
                          orderEdit={orderEdit}
                          moveCard={moveCard}
                          getMasters={getMasters}
                          selectMaster={selectMaster}
                        />
                      ))}
              </div>
            </Box>
          </Card>
          <Card sx={{ p: 3, my: 4, width: '100%' }}>
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
                label="달인"
                onChange={(event) => {
                  dispatch({
                    type: MasterRoomActionKind.CHANGE_CHANNEL,
                    payload: event.target.value,
                  });
                }}
                value={selectMaster}
                name="channel"
                select
                placeholder="달인"
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
              >
                {masters &&
                  masters.length > 0 &&
                  masters.map((master, i) => (
                    <option key={i} value={master.id}>
                      {master.nickname}
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
        </>
      ) : (
        <Typography variant="subtitle2" fontSize="20px" sx={{ m: 4 }}>
          계정을 생성해주세요.
        </Typography>
      )}
    </>
  );
};

export default MasterRoomPresenter;
