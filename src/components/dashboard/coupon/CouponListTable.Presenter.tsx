import React from 'react';
import moment from 'moment';
import {
  Box,
  Button,
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

const isUsedOption = [
  { title: '전체', value: [0, 1] },
  { title: '사용', value: 1 },
  { title: '미사용', value: 0 },
];
const sortOption = [
  { title: '발급날짜 (최신)', value: 'issuedDate:DESC' },
  { title: '발급날짜 (오래된 순)', value: 'issuedDate:ASC' },
  { title: '사용날짜 (최신)', value: 'usedDate:DESC' },
  { title: '사용날짜 (오래된 순)', value: 'usedDate:ASC' },
  { title: '만료날짜 (최신)', value: 'expirationDate:DESC' },
  { title: '만료날짜 (오래된 순)', value: 'expirationDate:ASC' },
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
    handleIsused,
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
            label={'사용 여부'}
            name="isUsed"
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={handleIsused}
          >
            {isUsedOption.map((date: any, i) => (
              <option key={i} value={date.value}>
                {date.title}
              </option>
            ))}
          </TextField>
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
                  <TableCell>쿠폰</TableCell>
                  <TableCell>코드</TableCell>
                  <TableCell>기관</TableCell>
                  <TableCell>발급 날짜</TableCell>
                  <TableCell>사용 날짜</TableCell>
                  <TableCell>사용한 유저</TableCell>
                  <TableCell>사용 여부</TableCell>
                  <TableCell>만료 날짜</TableCell>
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
                          {list.displayName
                            ? list.displayName
                            : '제목이 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {list.code ? list.code : '코드가 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {list.agency
                            ? list.agency
                            : '기관이 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {moment(list.issuedDate)
                            .utc()
                            .format('YYYY년 M월 D일 HH:mm')}
                        </TableCell>
                        <TableCell>
                          {list.usedDate
                            ? moment(list.usedDate)
                                .utc()
                                .format('YYYY년 M월 D일 HH:mm')
                            : '미사용'}
                        </TableCell>
                        <TableCell>
                          {list.userId ? list.userId : '미사용'}
                        </TableCell>
                        <TableCell>
                          {list.isUsed ? '사용' : '미사용'}
                        </TableCell>
                        <TableCell>
                          {moment(list?.expirationDate)
                            .utc()
                            .format('YYYY년 M월 D일 HH:mm')}
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
