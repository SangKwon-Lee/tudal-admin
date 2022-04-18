import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import dayjs from 'dayjs';

interface CpListProps {
  dispatch: (params: CpListAction) => void;
  cpListState: CpListState;
}

const CpListPresenter: React.FC<CpListProps> = (props) => {
  const { cpListState, dispatch } = props;
  const { loading, cpList } = cpListState;
  return (
    <>
      <Card sx={{ my: 4 }}>
        {loading && <LinearProgress />}
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 400,
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
        </Box>
        <Divider />
        <Scrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 'bold' }}
                    >
                      이름
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    번호
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    이메일
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    등록 날짜
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ pl: 2.3, fontWeight: 'bold' }}
                    >
                      달인
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
                            <Box>
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
                        <TableCell>
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
                          {`${dayjs(cp.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}`}
                        </TableCell>
                        <TableCell>
                          {cp.masters[0]?.id ? (
                            <Button
                              variant="contained"
                              component={RouterLink}
                              to={`/dashboard/cp/${cp.id}/master`}
                            >
                              달인
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="inherit"
                              component={RouterLink}
                              to={`/dashboard/cp/master/signup/${cp.id}`}
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
          sx={{ p: 1 }}
          size="small"
          color="primary"
          variant="text"
          count={Math.ceil(cpListState.cpListLength / 50)}
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
