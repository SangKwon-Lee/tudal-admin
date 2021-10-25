import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import { FC } from 'react';
import {
  MasterSubscribeAction,
  MasterSubscribeState,
} from './MasterSubscribe.Container';
import { useTheme } from '@material-ui/core/styles';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface IMasterSubscribeProps {
  masterSubscribeState: MasterSubscribeState;
  dispatch: (params: MasterSubscribeAction) => void;
  handleChangeYear: (event: any) => void;
}

const MasterSubscribePresenter: FC<IMasterSubscribeProps> = (
  props,
) => {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ['#7783DB'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0,
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    markers: {
      strokeColors: theme.palette.background.paper,
      size: 6,
    },
    stroke: {
      curve: 'straight',
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
  };

  const { masterSubscribeState, handleChangeYear } = props;
  const {
    loading,
    subscription,
    getYear,
    thisMonth,
    allSubscription,
  } = masterSubscribeState;
  return (
    <>
      {loading && (
        <div data-testid="news-list-loading">
          <LinearProgress />
        </div>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Card sx={{ p: 3, my: 2, width: '30%' }}>
          <CardHeader title="총 구독자" />
          <Divider />
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ mt: 2 }} variant="h6">
              {allSubscription} 명
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ p: 3, my: 2, width: '30%' }}>
          <CardHeader title="이번 달 구독자" />
          <Divider />
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ mt: 2 }} variant="h6">
              {thisMonth.length > 0 ? thisMonth[0] : 0} 명
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ p: 3, my: 2, width: '30%' }}>
          <CardHeader title="지난 달 구독자" />
          <Divider />
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ mt: 2 }} variant="h6">
              {thisMonth.length > 0 ? thisMonth[1] : 0} 명
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <CardHeader title="구독 현황" />
          <TextField
            label={'연도'}
            name="year"
            onChange={handleChangeYear}
            select
            SelectProps={{ native: true }}
            variant="outlined"
            sx={{ mx: 1 }}
          >
            {getYear.length > 0 ? (
              getYear
                .sort((a, b) => b - a)
                .map((year, index) => (
                  //@ts-ignore
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))
            ) : (
              <option>연도가 없습니다.</option>
            )}
          </TextField>
        </Box>
        <CardContent>
          <Chart
            height="300"
            options={chartOptions}
            series={subscription}
            type="area"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default MasterSubscribePresenter;
