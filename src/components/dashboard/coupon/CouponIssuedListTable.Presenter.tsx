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
  Typography,
} from '@material-ui/core';
import SearchIcon from 'src/icons/Search';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import Scrollbar from 'src/components/layout/Scrollbar';
import {
  CouponIssuedListTableAction,
  CouponIssuedListTableActionKind,
  CouponIssuedListTableState,
} from './CouponIssuedListTable.Container';
import moment from 'moment';

interface ICouponIssuedListTableProps {
  CouponIssuedListTableState: CouponIssuedListTableState;
  dispatch: (params: CouponIssuedListTableAction) => void;
  handleDelete: () => void;
  handleIsused: (event: any) => void;
  handleSelect: (event: any, selectId: number) => void;
  handleSelectAll: (event: any) => void;
  addIssuedCoupon: () => void;
  handleChangeExpirationDate: (event: any) => void;
  fileDownload: () => void;
}

const isUsedOption = [
  { title: '전체', value: '0,1' },
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
const expirationDateOption = [
  {
    title: '7일',
  },
  {
    title: '30일',
  },
  {
    title: '60일',
  },
  {
    title: '90일',
  },
  {
    title: '6개월',
  },
  {
    title: '1년',
  },
];
const numbers = [
  {
    title: '1개',
    value: 1,
  },
  {
    title: '10개',
    value: 10,
  },
  {
    title: '30개',
    value: 30,
  },
  {
    title: '50개',
    value: 50,
  },
  {
    title: '100개',
    value: 100,
  },
  {
    title: '300개',
    value: 300,
  },
  {
    title: '500개',
    value: 500,
  },
];
const CouponIssuedListTablePresenter: React.FC<ICouponIssuedListTableProps> =
  (props) => {
    const {
      CouponIssuedListTableState,
      dispatch,
      handleIsused,
      handleDelete,
      handleSelect,
      handleSelectAll,
      addIssuedCoupon,
      handleChangeExpirationDate,
      fileDownload,
    } = props;
    const { loading, query, selected, list, listLength } =
      CouponIssuedListTableState;

    const selectedSome =
      selected.length > 0 && selected.length < list.length;
    const selectedAll = selected.length === list.length;

    return (
      <>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Card sx={{ width: '35%', my: 4 }}>
            <Typography
              sx={{ fontSize: 15, fontWeight: 'bold', p: 2 }}
            >
              쿠폰 내용
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      쿠폰 이름
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="body2">
                      {CouponIssuedListTableState.coupon.displayName
                        ? CouponIssuedListTableState.coupon
                            .displayName
                        : '이름이 없습니다.'}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      기관
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="body2">
                      {CouponIssuedListTableState.coupon.agency
                        ? CouponIssuedListTableState.coupon.agency
                        : '기관이 없습니다.'}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      타입
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="body2">
                      {CouponIssuedListTableState.coupon.type
                        ? CouponIssuedListTableState.coupon.type
                        : '타입이 없습니다.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
          <Card sx={{ my: 3, width: '23%' }}>
            {loading && (
              <div data-testid="news-list-loading">
                <LinearProgress />
              </div>
            )}
            <Box sx={{ m: 2 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                쿠폰 추가 발급
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <TextField
                  select
                  label={'쿠폰 발급 개수'}
                  name="quantity"
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={(event) => {
                    dispatch({
                      type: CouponIssuedListTableActionKind.CHANGE_QUANTITY,
                      payload: event.target.value,
                    });
                  }}
                >
                  {numbers.map((date: any, i) => (
                    <option key={i} value={date.value}>
                      {date.title}
                    </option>
                  ))}
                </TextField>
                <TextField
                  select
                  label={'유효기간'}
                  name="expirationDate"
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleChangeExpirationDate}
                >
                  {expirationDateOption.map((date: any, i) => (
                    <option key={i} value={date.value}>
                      {date.title}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <Button
                sx={{ mt: 5 }}
                color="primary"
                variant="contained"
                onClick={addIssuedCoupon}
              >
                쿠폰 추가 발급
              </Button>
              <Button
                sx={{ mt: 5 }}
                variant="contained"
                onClick={fileDownload}
              >
                엑셀로 다운 받기
              </Button>
            </Box>
          </Card>
          <Card
            sx={{
              p: 3,
              my: 3,
              mx: 2,
              width: '25%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                발급된 쿠폰
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: 30, fontWeight: 'bold', mt: 6 }}
                >
                  {CouponIssuedListTableState.listLength}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                사용된 쿠폰
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: 30, fontWeight: 'bold', mt: 6 }}
                >
                  {CouponIssuedListTableState.isUsedLength}
                </Typography>
              </Box>
            </Box>
          </Card>
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
                    type: CouponIssuedListTableActionKind.CHANGE_QUERY,
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
              name="sort"
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={(event) => {
                dispatch({
                  type: CouponIssuedListTableActionKind.CHANGE_SORT,
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
                      type: CouponIssuedListTableActionKind.OPEN_DELETE_DIALOG,
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
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAll}
                        color="primary"
                        indeterminate={selectedSome}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>코드</TableCell>
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
                            {list.code
                              ? list.code
                              : '코드가 없습니다.'}
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
                type: CouponIssuedListTableActionKind.CHANGE_PAGE,
                payload: page,
              });
            }}
          />
        </Card>
        <Dialog
          aria-labelledby="ConfirmModal"
          open={CouponIssuedListTableState.delete.isDeleting}
          onClose={() => {
            dispatch({
              type: CouponIssuedListTableActionKind.CLOSE_DELETE_DIALOG,
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
                type: CouponIssuedListTableActionKind.CLOSE_DELETE_DIALOG,
              });
            }}
          />
        </Dialog>
      </>
    );
  };

export default CouponIssuedListTablePresenter;
