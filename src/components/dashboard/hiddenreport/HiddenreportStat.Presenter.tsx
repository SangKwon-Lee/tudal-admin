import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from '@material-ui/core';

import Scrollbar from '../../layout/Scrollbar';

import {
  IHRStatState,
  HRStatActionKind,
  HRStatAction,
} from './HiddenreportStat.Container';
import dayjs from 'dayjs';
import { applyPagination } from 'src/utils/sort';
import Loader from 'react-loader-spinner';

interface IHiddenReportStatPresenter {
  state: IHRStatState;
  dispatch: (params: HRStatAction) => void;
}

const HiddenReportStatPresenter: React.FC<IHiddenReportStatPresenter> =
  ({ state, dispatch }) => {
    const {
      orders,
      reportMap,
      orderPage,
      orderLimit,
      reportPage,
      reportLimit,
      loading,
    } = state;

    const sortedReports = Object.keys(reportMap).sort(
      (a, b) => reportMap[b].count - reportMap[a].count,
    );

    const paginatedReports = applyPagination(
      sortedReports,
      reportPage,
      reportLimit,
    );
    const paginatedOrders = applyPagination(
      orders,
      orderPage,
      orderLimit,
    );

    const handleOrderPage = (page) => {
      dispatch({
        type: HRStatActionKind.CHANGE_ORDER_PAGE,
        payload: page,
      });
    };

    const handleReportPage = (page) => {
      dispatch({
        type: HRStatActionKind.CHANGE_REPORT_PAGE,
        payload: page,
      });
    };

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
              type="CradleLoader"
              //   color="#10b981"
              color="#101827"
              height={100}
              width={100}
            />
          </Box>
        )}

        {!loading && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 3,
            }}
          >
            <Card sx={{ p: 3 }}>
              <CardHeader title="리포트" />
              <Divider />
              <Scrollbar>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>제목</TableCell>
                        <TableCell>가격</TableCell>
                        <TableCell>판매량</TableCell>
                        <TableCell>조회수</TableCell>
                        <TableCell>좋아요</TableCell>
                        <TableCell>등록일</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedReports.map((reportId, i) => {
                        const { count, hidden_report } =
                          reportMap[Number(reportId)];
                        return (
                          <TableRow hover key={i}>
                            <TableCell>
                              {hidden_report.title}
                            </TableCell>
                            <TableCell>
                              {hidden_report.price} GOLD
                            </TableCell>
                            <TableCell>{count}</TableCell>
                            <TableCell>
                              {hidden_report.numOfViews} 회
                            </TableCell>
                            <TableCell>
                              {hidden_report.numOfLikes} 개
                            </TableCell>
                            <TableCell>
                              {dayjs(hidden_report.created_at).format(
                                'YYYY-MM-DD HH:mm',
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Scrollbar>
            </Card>
            <TablePagination
              component="div"
              count={sortedReports.length}
              onPageChange={(event, value) => handleReportPage(value)}
              page={reportPage}
              rowsPerPage={reportLimit}
              rowsPerPageOptions={[3]}
            />

            <Box sx={{ p: 3 }}></Box>
            <Card sx={{ p: 3 }}>
              <CardHeader title="판매 내역" />
              <Divider />
              <Scrollbar>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>id</TableCell>
                        <TableCell>리포트</TableCell>
                        <TableCell>가격</TableCell>
                        <TableCell>유저 아이디</TableCell>
                        <TableCell>판매일</TableCell>
                        <TableCell>만료일</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedOrders.map((order) => (
                        <TableRow hover key={order.id}>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              {order.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {order.hidden_report?.title}
                          </TableCell>
                          <TableCell>
                            {order.hidden_report.price} GOLD
                          </TableCell>
                          <TableCell>{order.userId}</TableCell>
                          <TableCell>
                            {dayjs(order.created_at).format(
                              'YYYY-MM-DD HH:mm',
                            )}
                          </TableCell>
                          <TableCell>
                            {dayjs(
                              order.hidden_report?.expirationDate,
                            ).format('YYYY-MM-DD HH:mm')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Scrollbar>
            </Card>
            <TablePagination
              component="div"
              count={orders.length}
              onPageChange={(event, value) => handleOrderPage(value)}
              page={orderPage}
              rowsPerPage={orderLimit}
              rowsPerPageOptions={[10]}
            />
          </Box>
        )}
      </>
    );
  };

export default HiddenReportStatPresenter;
