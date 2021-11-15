import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Link,
  Card,
  Checkbox,
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
} from '@material-ui/core';
import SearchIcon from 'src/icons/Search';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import Scrollbar from 'src/components/layout/Scrollbar';
import {
  CouponListTableAction,
  CouponListTableActionKind,
  CouponListTableState,
} from './CouponListTable.Container';
import CouponCreateContainer from './CouponCreate.Container';

interface ICouponListTableProps {
  couponListTableState: CouponListTableState;
  dispatch: (params: CouponListTableAction) => void;
  handleDelete: () => void;
  getCouponList: () => void;
  getCouponListLength: () => void;
  handleIsused: (event: any) => void;
  handleSelect: (event: any, selectId: number) => void;
  handleSelectAll: (event: any) => void;
}

const sortOption = [
  { title: '발급날짜 (최신)', value: 'created_at:DESC' },
  { title: '발급날짜 (오래된 순)', value: 'created_at:ASC' },
];

const CouponListTablePresenter: React.FC<ICouponListTableProps> = (
  props,
) => {
  const {
    couponListTableState,
    dispatch,
    handleDelete,
    getCouponList,
    getCouponListLength,
    handleSelect,
    handleSelectAll,
  } = props;
  const { loading, query, selected, list, listLength, openModal } =
    couponListTableState;

  const selectedSome =
    selected.length > 0 && selected.length < list.length;
  const selectedAll = selected.length === list.length;
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Button
          color="primary"
          sx={{ ml: 2 }}
          variant="contained"
          onClick={() => {
            dispatch({
              type: CouponListTableActionKind.OPEN_CREATE_DIALOG,
            });
          }}
        >
          쿠폰 생성
        </Button>
      </Box>
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
                  type: CouponListTableActionKind.CHANGE_QUERY,
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
                type: CouponListTableActionKind.CHANGE_SORT,
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
                    type: CouponListTableActionKind.OPEN_DELETE_DIALOG,
                  });
                }}
              >
                삭제
              </Button>
              {/* <Button
                color="primary"
                sx={{ ml: 2 }}
                variant="outlined"
                component={RouterLink}
                to={`/dashboard/master/${selected}/edit`}
              >
                수정
              </Button> */}
            </Box>
          </Box>
        )}
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAll}
                      color="primary"
                      indeterminate={selectedSome}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>쿠폰 이름</TableCell>
                  <TableCell>쿠폰 영어 이름</TableCell>
                  <TableCell>기관</TableCell>
                  <TableCell>무료 기간</TableCell>
                  <TableCell>발급 날짜</TableCell>
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
                        <TableCell padding="checkbox">
                          <Checkbox
                            value={isSelected}
                            checked={isSelected}
                            color="primary"
                            onChange={(event) => {
                              handleSelect(event, list.id);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/dashboard/coupons/${list.id}`}
                            variant="subtitle2"
                          >
                            {list.displayName
                              ? list.displayName
                              : '제목이 없습니다.'}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {list.name ? list.name : '이름이 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {list.agency
                            ? list.agency
                            : '기관이 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {list.applyDays
                            ? `${list.applyDays}일`
                            : '없습니다.'}
                        </TableCell>
                        <TableCell>
                          {dayjs(list.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
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
          count={Math.ceil(listLength / 50)}
          variant="outlined"
          onChange={(event, page) => {
            dispatch({
              type: CouponListTableActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={couponListTableState.delete.isDeleting}
        onClose={() => {
          dispatch({
            type: CouponListTableActionKind.CLOSE_DELETE_DIALOG,
          });
        }}
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={'삭제시 큰 주의가 필요합니다.'}
          confirmTitle={'삭제'}
          handleOnClick={handleDelete}
          handleOnCancel={() => {
            dispatch({
              type: CouponListTableActionKind.CLOSE_DELETE_DIALOG,
            });
          }}
        />
      </Dialog>
      <CouponCreateContainer
        openModal={openModal}
        listDispatch={dispatch}
        getCouponList={getCouponList}
        getCouponListLength={getCouponListLength}
      />
    </>
  );
};

export default CouponListTablePresenter;
