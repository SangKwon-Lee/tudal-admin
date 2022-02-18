import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
  TextField,
  Pagination,
} from '@material-ui/core';

import Scrollbar from '../../layout/Scrollbar';

import {
  IHRStatState,
  HRStatActionKind,
  HRStatAction,
} from './HiddenreportStat.Container';
import dayjs from 'dayjs';
import Loader from 'react-loader-spinner';
import { DatePicker } from '@material-ui/lab';

interface IHiddenReportStatPresenter {
  state: IHRStatState;
  dispatch: (params: HRStatAction) => void;
}

const HiddenReportStatPresenter: React.FC<IHiddenReportStatPresenter> =
  ({ state, dispatch }) => {
    const { loading, query, payments, freeReportsPage } = state;
    return (
      <>
        {loading && (
          <Box
            style={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              minHeight: '100%',
            }}
          >
            <Loader
              type="ThreeDots"
              //   color="#10b981"
              color="#101827"
              height={100}
              width={100}
            />
          </Box>
        )}
        <Box
          sx={{
            backgroundColor: 'background.default',
            p: 3,
            display: 'flex',
          }}
        >
          <Card sx={{ p: 3, width: '300px', marginRight: 5 }}>
            <CardHeader title="총 판매 금액"></CardHeader>
            <Typography
              sx={{ fontSize: 22, fontWeight: 'bold', p: 2 }}
            >
              {payments.totalIncome} GOLD
            </Typography>
          </Card>
          <Card sx={{ p: 3, width: '300px', marginRight: 5 }}>
            <CardHeader title="총 판매 리포트 수"></CardHeader>
            <Typography
              sx={{ fontSize: 22, fontWeight: 'bold', p: 2 }}
            >
              {payments.totalSellCount} 개
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
                value={query.startDate || ''}
                onChange={(newValue) => {
                  dispatch({
                    type: HRStatActionKind.CHANGE_STARTDATE,
                    payload: dayjs(newValue).format('YYYY-MM-DD'),
                  });
                }}
              />
              <Box sx={{ m: 2 }}></Box>
              <DatePicker
                renderInput={(props) => <TextField {...props} />}
                label="End"
                value={query.endDate || ''}
                onChange={(newValue) => {
                  dispatch({
                    type: HRStatActionKind.CHANGE_ENDDATE,
                    payload: dayjs(newValue).format('YYYY-MM-DD'),
                  });
                }}
              />
            </Box>
          </Card>
        </Box>
        {!loading && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 3,
            }}
          >
            <Card sx={{ p: 3, mb: 3 }}>
              <CardHeader title="유료 리포트 판매 내역"></CardHeader>
              <Scrollbar>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>제목</TableCell>
                        <TableCell>가격 (Gold)</TableCell>
                        <TableCell>좋아요</TableCell>
                        <TableCell>판매량</TableCell>
                        <TableCell>등록일</TableCell>
                        <TableCell>만료일</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.paidReports
                        .slice(query._start, query._limit)
                        .map((report: any, index) => (
                          <TableRow hover key={report.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Link
                                color="textPrimary"
                                component={RouterLink}
                                to={`/dashboard/hiddenreports/${report.id}`}
                                variant="subtitle2"
                                style={{
                                  textDecoration: 'underline',
                                }}
                              >
                                {report.title}
                              </Link>
                            </TableCell>
                            <TableCell>{report.price}</TableCell>
                            <TableCell>{report.numOfLikes}</TableCell>
                            <TableCell>{report.sellCount}</TableCell>
                            <TableCell>
                              {dayjs(report.created_at).format(
                                'YYYY-MM-DD',
                              )}
                            </TableCell>
                            <TableCell>
                              {dayjs(report.expirationDate).format(
                                'YYYY-MM-DD',
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    variant="outlined"
                    count={Math.ceil(
                      payments.paidReports.length /
                        state.query._limit,
                    )}
                    onChange={(event, page) => {
                      dispatch({
                        type: HRStatActionKind.CHANGE_PAGE,
                        payload: page,
                      });
                    }}
                    page={state.page}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  />
                </Box>
              </Scrollbar>
            </Card>
            <Card sx={{ p: 3 }}>
              <CardHeader title="무료 리포트 판매 내역"></CardHeader>
              <Scrollbar>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>제목</TableCell>
                        <TableCell>가격 (Gold)</TableCell>
                        <TableCell>좋아요</TableCell>
                        <TableCell>판매량</TableCell>
                        <TableCell>등록일</TableCell>
                        <TableCell>만료일</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.freeReports
                        .slice(
                          freeReportsPage._start,
                          freeReportsPage._limit,
                        )
                        .map((report: any, index) => (
                          <TableRow hover key={report.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Link
                                color="textPrimary"
                                component={RouterLink}
                                to={`/dashboard/hiddenreports/${report.id}`}
                                variant="subtitle2"
                                style={{
                                  textDecoration: 'underline',
                                }}
                              >
                                {report.title}
                              </Link>
                            </TableCell>
                            <TableCell>{report.price}</TableCell>
                            <TableCell>{report.numOfLikes}</TableCell>
                            <TableCell>{report.sellCount}</TableCell>
                            <TableCell>
                              {dayjs(report.created_at).format(
                                'YYYY-MM-DD',
                              )}
                            </TableCell>
                            <TableCell>
                              {dayjs(report.expirationDate).format(
                                'YYYY-MM-DD',
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    variant="outlined"
                    count={Math.ceil(
                      payments.freeReports.length /
                        freeReportsPage._limit,
                    )}
                    onChange={(event, page) => {
                      dispatch({
                        type: HRStatActionKind.CHANGE_FREE_PAGE,
                        payload: page,
                      });
                    }}
                    page={freeReportsPage.page}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  />
                </Box>
              </Scrollbar>
            </Card>
          </Box>
        )}
      </>
    );
  };

export default HiddenReportStatPresenter;
