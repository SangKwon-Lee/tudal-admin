import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  LinearProgress,
  Pagination,
} from '@material-ui/core';
import SearchIcon from 'src/icons/Search';
import Scrollbar from 'src/components/layout/Scrollbar';
import {
  CpListActionKind,
  CpListAction,
  CpListState,
} from './CpList.Container';

interface CpListProps {
  dispatch: (params: CpListAction) => void;
  cpListState: CpListState;
}
const sortOption = [
  { title: '전체', value: '' },
  { title: '달인', value: 'master_null=false' },
  { title: '히든 리포터', value: 'hidden_reporter_null=false' },
];

const CpListPresenter: React.FC<CpListProps> = (props) => {
  const { cpListState, dispatch } = props;
  const { loading, cpList } = cpListState;
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          my: 2,
        }}
      >
        <Button
          variant="contained"
          component={RouterLink}
          to={`/dashboard/cp/create`}
        >
          CP 계정 생성
        </Button>
      </Box>
      <Card sx={{ my: 2 }}>
        {loading && <LinearProgress />}
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 500,
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                dispatch({
                  type: CpListActionKind.CHANGE_QUERY,
                  payload: e.target.value,
                });
              }}
              placeholder="검색"
              value={cpListState.query._q}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              mx: 1,
            }}
          >
            <TextField
              select
              sx={{ mx: 2 }}
              defaultValue="전체"
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={(event) => {
                dispatch({
                  type: CpListActionKind.CHANGE_FILTER,
                  payload: event.target.value,
                });
              }}
            >
              {sortOption.map((date: any, i) => (
                <option key={i} value={date.value}>
                  {date.title}
                </option>
              ))}
            </TextField>
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ pl: 1 }}>
                      이름
                    </Typography>
                  </TableCell>
                  <TableCell>번호</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>등록 날짜</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ pl: 2.3 }}>
                      달인
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ pl: 1 }}>
                      히든 리포터
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  cpList.map((cp) => {
                    return (
                      <TableRow hover key={cp.id}>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <Box sx={{ ml: 1, maxWidth: '150px' }}>
                              {cp.username
                                ? cp.username
                                : '이름이 없습니다.'}
                              <Typography
                                color="textSecondary"
                                variant="body2"
                              >
                                {`${
                                  cp.nickname || '닉네임이 없습니다.'
                                }`}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          style={{
                            maxWidth: '180px',
                            minWidth: '180px',
                          }}
                        >
                          {cp.phone_number
                            ? cp.phone_number
                            : '전화번호가 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {cp.contact_email
                            ? cp.contact_email
                            : '이메일이 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {`${moment(cp.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}`}
                        </TableCell>
                        <TableCell>
                          {cp.master?.id ? (
                            <Button
                              variant="outlined"
                              component={RouterLink}
                              to={`/dashboard/cp/${cp.master.id}/master`}
                            >
                              달인
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="inherit"
                              component={RouterLink}
                              to="/dashboard/cp/createMaster"
                            >
                              생성
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {cp.hidden_reporter?.id ? (
                            <Button
                              variant="outlined"
                              component={RouterLink}
                              to={`/dashboard/cp/${cp.hidden_reporter.id}/reporter`}
                            >
                              히든 리포터
                            </Button>
                          ) : (
                            <Button
                              color="inherit"
                              variant="outlined"
                              component={RouterLink}
                              to="/dashboard/cp/createReporter"
                            >
                              생성
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <Pagination
          count={Math.ceil(cpListState.cpListLength / 50)}
          variant="outlined"
          page={cpListState.page}
          onChange={(event, page) => {
            dispatch({
              type: CpListActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
    </>
  );
};

export default CpListPresenter;
