import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import Scrollbar from '../../layout/Scrollbar';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import ArrowRightIcon from 'src/icons/ArrowRight';
import { IHR } from 'src/types/hiddenreport';
import {
  HRListActionKind,
  IHRListAction,
  IHRListState,
  sortOptions,
} from './HiddenreportList.Container';
import dayjs from 'dayjs';

interface HRListPresenterProps {
  state: IHRListState;
  dispatch: (param: IHRListAction) => void;
}

const HiddenreportListPresenter: FC<HRListPresenterProps> = ({
  state,
  dispatch,
}) => {
  const { list } = state;
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        pt: 3,
      }}
    >
      <Card>
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
              placeholder="제목"
              variant="outlined"
              onChange={(e) => {
                dispatch({
                  type: HRListActionKind.CHANGE_QUERY,
                  payload: { value: e.target.value, name: '_q' },
                });
              }}
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 240,
            }}
          >
            <TextField
              label="Sort By"
              name="_sort"
              select
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={(e) => {
                dispatch({
                  type: HRListActionKind.CHANGE_QUERY,
                  payload: { value: e.target.value, name: '_sort' },
                });
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>
        </Box>
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
                  <TableCell>수정 / 더보기</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((report: IHR, index) => (
                  <TableRow hover key={report.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Link
                        color="textPrimary"
                        component={RouterLink}
                        to={`/dashboard/hiddenreports/${report.id}`}
                        variant="subtitle2"
                        style={{ textDecoration: 'underline' }}
                      >
                        {report.title}
                      </Link>
                    </TableCell>
                    <TableCell>{report.price}</TableCell>
                    <TableCell>{report.numOfLikes}</TableCell>
                    <TableCell>{report.numOfOrders}</TableCell>
                    <TableCell>
                      {dayjs(report.created_at).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell>
                      {dayjs(report.expirationDate).format(
                        'YYYY-MM-DD',
                      )}
                    </TableCell>

                    <TableCell>
                      <IconButton>
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={`/dashboard/hiddenreports/${report.id}/edit`}
                          variant="subtitle2"
                        >
                          <PencilAltIcon fontSize="small" />
                        </Link>
                      </IconButton>
                      <IconButton>
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={`/dashboard/hiddenreports/${report.id}`}
                          variant="subtitle2"
                        >
                          <ArrowRightIcon fontSize="small" />
                        </Link>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              variant="outlined"
              count={Math.ceil(state.listLength / state.query._limit)}
              onChange={(event, page) => {
                dispatch({
                  type: HRListActionKind.CHANGE_PAGE,
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
    </Box>
  );
};

export default HiddenreportListPresenter;
