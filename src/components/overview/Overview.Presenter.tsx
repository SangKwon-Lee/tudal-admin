import React from 'react';
import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Card,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@material-ui/core';
import { OverviewState, OverviewAction } from './Overview.Container';
import { DashboardChart } from '../widgets/charts/DashboardChart';
import { DashboardChart2 } from '../widgets/charts/DashboardChart2';
import dayjs from 'dayjs';

interface OverviewProps {
  overviewState: OverviewState;
  dispatch: (params: OverviewAction) => void;
  getDarin: (id: any) => void;
  getSubnum: (id: any) => void;
  getSubnumchart: (id: any) => void;
  getPaidnum: (id: any) => void;
  getPaidnumchart: (id: any) => void;
  getTotalpaidnum: (id: any) => void;
  getPaidchart: (id: any) => void;
  getTotalfeednum: (id: any) => void;
  getMonthlyfeednum: (id: any) => void;
  getTotalhiddenorder: (id: any) => void;
  getTotalhiddennum: (id: any) => void;
  getHiddenchart: (id: any) => void;
}

const OverviewPresenter: React.FC<OverviewProps> = (props) => {
  const [toggle, setToggle] = useState('combined');
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newToggle: string,
  ) => {
    setToggle(newToggle);
  };

  const {
    overviewState,
    getDarin,
    getSubnum,
    getSubnumchart,
    getPaidnum,
    getPaidnumchart,
    getTotalpaidnum,
    getPaidchart,
    getTotalfeednum,
    getMonthlyfeednum,
    getTotalhiddenorder,
    getTotalhiddennum,
    getHiddenchart,
  } = props;
  const {
    users,
    darin,
    dates,
    subnum,
    subnumchart,
    paidnum,
    paidnumchart,
    totalpaidnum,
    paidchart,
    totalfeednum,
    monthlyfeednum,
    totalhiddenorder,
    totalhiddennum,
    hiddenchart,
    csubnum,
    csubnumchart,
    cpaidnum,
    cpaidnumchart,
    ctotalpaidnum,
    ctotalpaidamount,
    cpaidchart,
    ctotalfeednum,
    cmonthlyfeednum,
    ctotalhiddenorder,
    ctotalhiddennum,
    chiddenchart,
  } = overviewState;

  return (
    <>
      <ToggleButtonGroup
        value={toggle}
        aria-label="toggle"
        exclusive
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mt: 2,
        }}
        onChange={handleChange}
      >
        <ToggleButton sx={{ borderRadius: '10px' }} value="combined">
          통합
        </ToggleButton>
        <ToggleButton sx={{ borderRadius: '10px' }} value="personal">
          개인
        </ToggleButton>
      </ToggleButtonGroup>
      {toggle === 'combined' && toggle ? (
        <Card
          sx={{
            my: 2,
            backgroundColor: '#171C24',
            borderRadius: '10px',
            height: '100vh',
            borderColor: 'transparent',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card
                sx={{
                  p: 1,
                }}
              >
                <Typography variant="h6"> 이용자 현황</Typography>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    구독자 수 : {csubnum ? csubnum : 0} 명
                  </Typography>
                  <Typography>
                    유료이용자 수 : {cpaidnum ? cpaidnum : 0} 명
                  </Typography>
                </Box>
                {csubnumchart && cpaidnumchart ? (
                  <DashboardChart2
                    DB1={csubnumchart}
                    DB2={cpaidnumchart}
                    dates={dates}
                    dataName1={'일별 신규 구독자 수'}
                    dataName2={'일별 신규 유료 이용자 수'}
                  />
                ) : null}
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
                sx={{
                  p: 1,
                }}
              >
                <Typography variant="h6">
                  유료 구독 결제 현황
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    누적 결제 횟수 :{' '}
                    {ctotalpaidnum ? ctotalpaidnum : 0}번
                  </Typography>
                  <Typography>
                    누적 결제 총액 :{' '}
                    {ctotalpaidamount ? ctotalpaidamount : 0}원
                  </Typography>
                </Box>
                {cpaidchart ? (
                  <DashboardChart
                    DB={cpaidchart}
                    dates={dates}
                    dataName={'일별 결제 수'}
                  />
                ) : null}
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ p: 1 }}>
                <Typography variant="h6">피드 현황</Typography>
                <Box
                  sx={{
                    p: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    누적 피드 개수 :{' '}
                    {ctotalfeednum ? ctotalfeednum : 0}개
                  </Typography>
                  <Typography>
                    {dayjs(new Date()).month()}월 피드 개수 :{' '}
                    {cmonthlyfeednum ? cmonthlyfeednum : 0}개
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
                sx={{
                  p: 1,
                }}
              >
                <Typography variant="h6">히든리포트 현황</Typography>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    누적 히든리포트 개수 :{' '}
                    {ctotalhiddennum ? ctotalhiddennum : 0}개
                  </Typography>
                  <Typography>
                    누적 히든리포트 판매 횟수 : &nbsp;
                    {ctotalhiddenorder ? ctotalhiddenorder : 0}번
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 1 }}>
                <Box>
                  <Typography variant="h6">
                    히든리포트 판매 현황
                  </Typography>
                  {chiddenchart ? (
                    <DashboardChart
                      DB={chiddenchart}
                      dates={dates}
                      dataName={'일별 판매된 히든리포트 수'}
                    />
                  ) : null}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Card>
      ) : toggle === 'personal' ? (
        <Card
          sx={{
            backgroundColor: '#171C24',
            my: 2,
            borderRadius: '10px',
            height: '100vh',
          }}
        >
          <Typography variant="h6">달인 선택</Typography>
          <Autocomplete
            fullWidth
            autoHighlight
            options={users}
            autoSelect
            getOptionLabel={(users) => users.nickname}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder={darin ? darin.nickname : '달인'}
              />
            )}
            // * 달인 리스트에서 달인을 선택했을 때 필요한 해당 달인의 정보를 불어오는 함수들을 실행시킨다.
            // * onChange에 넣기 위해서 Container에서 로직을 짜서 Presenter에서 넘겨받아 실행한다.
            onChange={(e, options) => {
              // @ts-ignore
              getDarin(options.id);
              // @ts-ignore
              getSubnum(options.id);
              // @ts-ignore
              getSubnumchart(options.id);
              // @ts-ignore
              getPaidnum(options.id);
              // @ts-ignore
              getPaidnumchart(options.id);
              // @ts-ignore
              getPaidchart(options.id);
              // @ts-ignore
              getTotalpaidnum(options.id);
              // @ts-ignore
              getTotalfeednum(options.id);
              // @ts-ignore
              getMonthlyfeednum(options.id);
              // @ts-ignore
              getTotalhiddenorder(options.id);
              // @ts-ignore
              getTotalhiddenorder(options.id);
              // @ts-ignore
              getTotalhiddennum(options.id);
              // @ts-ignore
              getHiddenchart(options.id);
            }}
            sx={{
              my: 1,
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card
                sx={{
                  p: 1,
                  mt: 1,
                }}
              >
                <Typography variant="h6"> 이용자 현황</Typography>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    구독자 수 : {subnum ? subnum : 0} 명
                  </Typography>
                  <Typography>
                    유료이용자 수 : {paidnum ? paidnum : 0} 명
                  </Typography>
                </Box>
                {subnumchart && paidnumchart ? (
                  <DashboardChart2
                    DB1={subnumchart}
                    DB2={paidnumchart}
                    dates={dates}
                    dataName1={'일별 신규 구독자 수'}
                    dataName2={'일별 신규 유료 이용자 수'}
                  />
                ) : null}
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
                sx={{
                  p: 1,
                  mt: 1,
                }}
              >
                <Typography variant="h6">
                  유료 구독 결제 현황
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    누적 결제 횟수 : {totalpaidnum ? totalpaidnum : 0}
                    번
                  </Typography>
                  <Typography>
                    누적 결제 총액 :{' '}
                    {darin
                      ? darin.price_gold * totalpaidnum * 100
                      : 0}
                    원
                  </Typography>
                </Box>
                {paidchart ? (
                  <DashboardChart
                    DB={paidchart}
                    dates={dates}
                    dataName={'일별 결제 수'}
                  />
                ) : null}
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ p: 1 }}>
                <Typography variant="h6">피드 현황</Typography>
                <Box
                  sx={{
                    p: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    누적 피드 개수 : {totalfeednum ? totalfeednum : 0}
                    개{' '}
                  </Typography>
                  <Typography>
                    월별 피드 개수 :{' '}
                    {monthlyfeednum ? monthlyfeednum : 0}개
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
                sx={{
                  p: 1,
                }}
              >
                <Typography variant="h6">히든리포트 현황</Typography>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography>
                    누적 히든리포트 개수 :{' '}
                    {totalhiddennum ? totalhiddennum : 0}개
                  </Typography>
                  <Typography>
                    누적 히든리포트 판매 횟수 :{' '}
                    {totalhiddenorder ? totalhiddenorder : 0}번
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 1 }}>
                <Box>
                  <Typography variant="h6">
                    히든리포트 판매 현황
                  </Typography>
                  {hiddenchart ? (
                    <DashboardChart
                      DB={hiddenchart}
                      dates={dates}
                      dataName={'일별 판매된 히든리포트 개수'}
                    />
                  ) : null}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Card>
      ) : null}
    </>
  );
};

export default OverviewPresenter;
