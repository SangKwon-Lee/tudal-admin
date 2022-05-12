import { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Dialog,
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
import SearchIcon from '../../../icons/Search';
import ArrowRightIcon from 'src/icons/ArrowRight';
import { IHR } from 'src/types/hiddenreport';
import {
  HRListActionKind,
  IHRListAction,
  IHRListState,
  sortOptions,
  priceOptions,
} from './HiddenreportList.Container';
import dayjs from 'dayjs';

import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import PencilAlt from 'src/icons/PencilAlt';

interface HRListPresenterProps {
  state: IHRListState;
  dispatch: (param: IHRListAction) => void;
  deleteReport: (id: number) => void;
}

const HiddenreportListPresenter: FC<HRListPresenterProps> = ({
  state,
  dispatch,
  deleteReport,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<number>(null);
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
              width: 140,
            }}
          >
            <TextField
              label="정렬"
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
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 240,
            }}
          >
            <TextField
              label="무료/유료"
              name="_price"
              select
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={(e) => {
                dispatch({
                  type: HRListActionKind.CHANGE_PRICE,
                  payload: {
                    value: e.target.value,
                    name: 'price',
                  },
                });
              }}
            >
              {priceOptions.map((option, index) => (
                <option
                  key={index}
                  value={[
                    String(option.price_gt),
                    String(option.price_lt),
                  ]}
                >
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
                  <TableCell>등록일</TableCell>
                  <TableCell>만료일</TableCell>
                  <TableCell>더보기 / 삭제</TableCell>
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
                          to={`/dashboard/hiddenreports/${report.id}`}
                        >
                          <ArrowRightIcon fontSize="small" />
                        </Link>
                      </IconButton>
                      <IconButton>
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={`/dashboard/hiddenreports/${report.id}/edit`}
                        >
                          <PencilAlt fontSize="small" />
                        </Link>
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setDeleteTarget(report.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
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

            <Dialog
              aria-labelledby="ConfirmModal"
              open={Boolean(deleteTarget)}
              onClose={() => {
                setDeleteTarget(null);
              }}
            >
              <ConfirmModal
                title="리포트 삭제"
                content="해당 리포트를 삭제하시겠습니까?"
                confirmTitle={'삭제'}
                type={'ERROR'}
                handleOnClick={() => {
                  deleteReport(deleteTarget);
                  setDeleteTarget(null);
                }}
                handleOnCancel={() => {
                  setDeleteTarget(null);
                }}
              />
            </Dialog>
          </Box>
        </Scrollbar>
      </Card>
    </Box>
  );
};

export default HiddenreportListPresenter;
