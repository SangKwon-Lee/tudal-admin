import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  Card,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  LinearProgress,
  Pagination,
  IconButton,
} from '@material-ui/core';
import dayjs from 'dayjs';
import ArrowRightIcon from 'src/icons/ArrowRight';

import SearchIcon from 'src/icons/Search';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import Scrollbar from 'src/components/layout/Scrollbar';
import {
  GroupListTableAction,
  GroupListTableActionKind,
  GroupListTableState,
} from './GroupList.Container';

interface IGroupListTableProps {
  groupListTableState: GroupListTableState;
  dispatch: (params: GroupListTableAction) => void;
  getGroupList: () => void;
}

const sortOption = [
  { title: '발급날짜 (최신)', value: 'created_at:DESC' },
  { title: '발급날짜 (오래된 순)', value: 'created_at:ASC' },
];

const CouponListTablePresenter: React.FC<IGroupListTableProps> = (
  props,
) => {
  const { groupListTableState, dispatch, getGroupList } = props;
  const { loading, query, selected, list, listLength } =
    groupListTableState;

  return (
    <>
      <Box sx={{ mb: 3 }}></Box>
      <Card>
        {loading && (
          <div data-testid="news-list-loading">
            <LinearProgress />
          </div>
        )}
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
              onChange={(event) => {
                dispatch({
                  type: GroupListTableActionKind.CHANGE_QUERY,
                  payload: event.target.value,
                });
              }}
              placeholder="쿠폰 코드 기관 검색"
              value={query._q}
              variant="outlined"
            />
          </Box>

          <TextField
            select
            sx={{ mx: 2 }}
            label={'정렬'}
            name="isUsed"
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={(event) => {
              dispatch({
                type: GroupListTableActionKind.CHANGE_SORT,
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
        {selected.length > 0 && (
          <Box>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                px: '4px',
                width: '100%',
                zIndex: 2,
              }}
            >
              <Button
                color="primary"
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={() => {
                  dispatch({
                    type: GroupListTableActionKind.OPEN_DELETE_DIALOG,
                  });
                }}
              >
                삭제
              </Button>
            </Box>
          </Box>
        )}
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>노출 여부</TableCell>
                  <TableCell>종목</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell>최종수정일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  list.map((list) => {
                    const isSelected = selected.includes(list.id);
                    return (
                      <TableRow
                        hover
                        key={list.id}
                        selected={isSelected}
                      >
                        <TableCell>{list.id}</TableCell>
                        <TableCell>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/dashboard/coupons/${list.id}`}
                            variant="subtitle2"
                          >
                            {list.name
                              ? list.name
                              : '제목이 없습니다.'}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {list.show ? 'OPEN' : 'CLOSE'}
                        </TableCell>
                        <TableCell>{list.numStocks}</TableCell>

                        <TableCell>
                          {dayjs(list.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}
                        </TableCell>
                        <TableCell>
                          {dayjs(list.updated_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            component={RouterLink}
                            to={`/dashboard/group/${list.id}`}
                          >
                            <ArrowRightIcon fontSize="small" />
                          </IconButton>{' '}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <Pagination
          count={Math.ceil(listLength / 20)}
          variant="outlined"
          onChange={(event, page) => {
            dispatch({
              type: GroupListTableActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={groupListTableState.delete.isDeleting}
        onClose={() => {
          dispatch({
            type: GroupListTableActionKind.CLOSE_DELETE_DIALOG,
          });
        }}
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={'삭제시 큰 주의가 필요합니다.'}
          confirmTitle={'삭제'}
          handleOnClick={() => console.log('he')}
          handleOnCancel={() => {
            dispatch({
              type: GroupListTableActionKind.CLOSE_DELETE_DIALOG,
            });
          }}
        />
      </Dialog>
    </>
  );
};

export default CouponListTablePresenter;
