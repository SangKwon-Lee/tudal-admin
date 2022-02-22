import {
  Box,
  Card,
  CardHeader,
  Typography,
  TextField,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/lab';
import dayjs from 'dayjs';
import { IMaster } from 'src/types/master';
import {
  MasterProfileAction,
  MasterProfileActionKind,
} from './MasterProfile.Container';
import { MasterProfileState } from './MasterProfile.Container';
import MasterProfileTable from './MasterProfileTable.Presenter';

interface IMasterProfileProps {
  masters: IMaster[];
  masterProfileState: MasterProfileState;
  dispatch: (params: MasterProfileAction) => void;
}

const MasterProfilePresenter: React.FC<IMasterProfileProps> = ({
  masters,
  masterProfileState,
  dispatch,
}) => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          pt: 3,
          mb: 3,
        }}
      >
        <Card sx={{ p: 3, width: '300px', marginRight: 5 }}>
          <CardHeader title="총 판매 금액"></CardHeader>
          <Typography sx={{ fontSize: 22, fontWeight: 'bold', p: 2 }}>
            {masterProfileState.total.totalIncome} GOLD
          </Typography>
        </Card>
        <Card sx={{ p: 3, width: '300px', marginRight: 5 }}>
          <CardHeader title="총 판매 수"></CardHeader>
          <Typography sx={{ fontSize: 22, fontWeight: 'bold', p: 2 }}>
            {masterProfileState.total.numOfPayments} 개
          </Typography>
        </Card>
        <Card sx={{ p: 3, width: '50%' }}>
          <CardHeader title="판매 기간 검색"></CardHeader>
          <Typography sx={{ pl: 2 }}>
            입력 않을 경우 전체 기간으로 검색됩니다.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex' }}>
            <DatePicker
              renderInput={(props) => <TextField {...props} />}
              label="Start"
              value={dayjs(masterProfileState.query.startDate).format(
                'YYYY-MM-DD',
              )}
              onChange={(newValue) => {
                dispatch({
                  type: MasterProfileActionKind.CHANGE_STARTDATE,
                  payload: dayjs(newValue).format(),
                });
              }}
            />
            <Box sx={{ m: 2 }}></Box>
            <DatePicker
              renderInput={(props) => <TextField {...props} />}
              label="End"
              value={dayjs(masterProfileState.query.endDate).format(
                'YYYY-MM-DD',
              )}
              onChange={(newValue) => {
                dispatch({
                  type: MasterProfileActionKind.CHANGE_ENDDATE,
                  payload: dayjs(newValue).format(),
                });
              }}
            />
          </Box>
        </Card>
      </Box>
      {masters.map((master, i) => (
        <MasterProfileTable key={i} master={master} />
      ))}
    </>
  );
};

export default MasterProfilePresenter;
