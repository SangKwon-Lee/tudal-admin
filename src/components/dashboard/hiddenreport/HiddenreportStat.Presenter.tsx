import React, { useState } from 'react';
import * as _ from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
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
  TableSortLabel,
  Link,
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

    // report sort
    const [reportSort, setReportSort] =
      useState<string>('count|desc');
    const [reportSortBy, reportSortOrder] = reportSort.split('|');

    // order sort
    const [orderSort, setOrderSort] =
      useState<string>('created_at|desc');
    const [orderSortBy, orderSortOrder] = orderSort.split('|');

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

    const handleReportSort = () => {
      const order = reportSortOrder === 'desc' ? 'asc' : 'desc';
      setReportSort('count|' + order);
    };

    const handleOrderSort = () => {
      const order = orderSortOrder === 'desc' ? 'asc' : 'desc';
      setOrderSort('created_at|' + order);
    };

    const reports = _.values(reportMap);

    let sortedReports = _.sortBy(reports, reportSortBy);
    if (reportSortOrder === 'desc') {
      sortedReports = sortedReports.reverse();
    }

    let sortedOrders = _.sortBy(orders, orderSortBy);
    if (orderSortOrder === 'desc') {
      sortedOrders = sortedOrders.reverse();
    }

    const paginatedReports = applyPagination(
      sortedReports,
      reportPage,
      reportLimit,
    );

    const paginatedOrders = applyPagination(
      sortedOrders,
      orderPage,
      orderLimit,
    );
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

        {!loading && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 3,
            }}
          >
            <Card sx={{ p: 3 }} style={{ minHeight: '350px' }}>
              <CardHeader title="리포트" />
              <Divider />
              <Scrollbar>
                <Box>
                  {paginatedReports.length ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>제목</TableCell>
                          <TableCell>가격</TableCell>
                          <TableCell>
                            <TableSortLabel
                              active
                              //@ts-ignore
                              direction={reportSortOrder}
                              onClick={handleReportSort}
                            >
                              판매량
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>조회수</TableCell>
                          <TableCell>좋아요</TableCell>
                          <TableCell>등록일</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedReports.map((report, i) => {
                          const { count, hidden_report } = report;
                          return (
                            <TableRow hover key={i}>
                              <TableCell>
                                <Link
                                  color="textPrimary"
                                  component={RouterLink}
                                  to={`/dashboard/hiddenreports/${hidden_report.id}`}
                                  variant="subtitle2"
                                  style={{
                                    textDecoration: 'underline',
                                  }}
                                >
                                  {hidden_report.title}
                                </Link>
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
                                {dayjs(
                                  hidden_report.created_at,
                                ).format('YYYY-MM-DD HH:mm')}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div>현재 판매된 리포트가 없습니다.</div>
                  )}
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
            <Card sx={{ p: 3 }} style={{ minHeight: '350px' }}>
              <CardHeader title="판매 내역" />
              <Divider />
              <Scrollbar>
                <Box>
                  {paginatedOrders.length ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>id</TableCell>
                          <TableCell>리포트</TableCell>
                          <TableCell>가격</TableCell>
                          <TableCell>유저 아이디</TableCell>
                          <TableCell>
                            <TableSortLabel
                              active
                              //@ts-ignore
                              direction={orderSortOrder}
                              onClick={handleOrderSort}
                            >
                              판매일
                            </TableSortLabel>
                          </TableCell>
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
                  ) : (
                    <div>현재 판매된 리포트가 없습니다.</div>
                  )}
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
