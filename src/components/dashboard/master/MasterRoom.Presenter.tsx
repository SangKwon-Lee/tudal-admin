import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Typography,
} from '@material-ui/core';
import { AxiosError } from 'axios';
import { FC } from 'react';
import PlusIcon from '../../../icons/Plus';

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
}

const MasterRoomPresenter: FC<IMasterRoomProps> = (props) => {
  const { newState, changeRoomInput } = props;
  const { master_room } = newState;
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
            방 형식
          </Typography>
          <Button
            color="primary"
            // eslint-disable-next-line react/jsx-no-undef
            startIcon={<PlusIcon fontSize="small" />}
            sx={{ mb: 3 }}
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
            sx={{ width: 200 }}
            label="방 타입"
            onChange={changeRoomInput}
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
        <Divider sx={{ my: 2 }} />
        {master_room.length > 0
          ? master_room.map((data) => (
              <Card key={data.id} sx={{ p: 3, m: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '50%',
                    }}
                  >
                    방 정보
                  </Typography>
                  <Button
                    color="primary"
                    // eslint-disable-next-line react/jsx-no-undef
                    startIcon={<PlusIcon fontSize="small" />}
                    sx={{ mb: 3 }}
                    variant="contained"
                  >
                    방 수정
                  </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '50%',
                    }}
                  >
                    방 이름
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '50%',
                    }}
                  >
                    {data.title}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '50%',
                    }}
                  >
                    방 타입
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '50%',
                    }}
                  >
                    {data.openType}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '50%',
                    }}
                  >
                    방 순서
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '50%',
                    }}
                  >
                    {data.order}
                  </Typography>
                </Box>
              </Card>
            ))
          : '방이 없습니다'}
      </Card>
    </>
  );
};

export default MasterRoomPresenter;
