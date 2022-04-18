import {
  Box,
  Card,
  CardHeader,
  InputAdornment,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
} from '@material-ui/core';
import React from 'react';
import {
  BannerListAction,
  BannerListActionKind,
  BannerListState,
} from './BannerList.Container';
import SearchIcon from '../../../icons/Search';
import Scrollbar from 'src/components/layout/Scrollbar';
import dayjs from 'dayjs';
import DraggableCard from './BannerDnD.Container';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';

interface IBannerListProps {
  bannerListState: BannerListState;
  dispatch: (param: BannerListAction) => void;
  postOneBanner: () => void;
  saveBanner: () => Promise<void>;
  moveCard: (
    dragIndex?: number,
    hoverIndex?: number,
  ) => Promise<void>;
}

const sortOptions = [
  {
    label: '등록순 (최신)',
    value: 'created_at:desc',
  },
  {
    label: '등록순 (오래된)',
    value: 'created_at:asc',
  },
];

const BannerListPresenter: React.FC<IBannerListProps> = (props) => {
  const {
    bannerListState,
    dispatch,
    postOneBanner,
    moveCard,
    saveBanner,
  } = props;
  const { reports, orderEdit, openBannerList, newOrder } =
    bannerListState;

  const cards = orderEdit ? newOrder : openBannerList;
  return (
    <>
      <Card sx={{ my: 4, mx: 5 }}>
        <CardHeader sx={{ m: 1 }} title="현재 등록된 배너" />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            mr: 4,
            my: 1,
          }}
        >
          {!bannerListState.orderEdit ? (
            <Button
              variant="contained"
              onClick={() => {
                dispatch({
                  type: BannerListActionKind.CHANGE_ORDER_EDIT,
                  payload: true,
                });
                dispatch({
                  type: BannerListActionKind.CHANGE_NEWORDER,
                  payload: openBannerList,
                });
              }}
            >
              배너 수정
            </Button>
          ) : (
            <>
              <Button
                sx={{ mx: 1 }}
                variant="contained"
                onClick={() => {
                  dispatch({
                    type: BannerListActionKind.CHANGE_ORDER_EDIT,
                    payload: false,
                  });
                  dispatch({
                    type: BannerListActionKind.CHANGE_NEWORDER,
                    payload: openBannerList,
                  });
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch({
                    type: BannerListActionKind.CHANGE_OPEN_MODAL,
                    payload: true,
                  });
                }}
              >
                저장
              </Button>
            </>
          )}
        </Box>
        <div
          style={{
            cursor: 'move',
            display: 'flex',
          }}
        >
          {cards.length > 0 &&
            cards.map((list, i) => (
              <DraggableCard
                key={i}
                id={list?.id}
                index={i + 1}
                orderEdit={orderEdit}
                moveCard={moveCard}
                dispatch={dispatch}
                title={list?.title ? list?.title : '제목이 없습니다.'}
                nickname={
                  list?.hidden_reporter?.nickname
                    ? list?.hidden_reporter?.nickname
                    : '닉네임이 없습니다.'
                }
                newOrder={newOrder}
                img={list?.hidden_report_image?.thumbnailImageUrl}
              />
            ))}
        </div>
      </Card>

      <Card sx={{ my: 4, mx: 5 }}>
        <CardHeader sx={{ m: 1 }} title="리포트 리스트" />
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
              width: 300,
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
              placeholder="제목 검색"
              variant="outlined"
              onChange={(e) => {
                dispatch({
                  type: BannerListActionKind.CHANGE_QUERY,
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
                  type: BannerListActionKind.CHANGE_QUERY,
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
                  <TableCell>제목</TableCell>
                  <TableCell>이미지</TableCell>
                  <TableCell>좋아요</TableCell>
                  <TableCell>판매량</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell>만료일</TableCell>
                  <TableCell sx={{ pl: 3.5 }}>배너 등록</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow hover key={report.id}>
                    <TableCell>{report.title}</TableCell>

                    <TableCell>
                      <img
                        style={{ width: '100px' }}
                        alt="이미지"
                        src={
                          report.hidden_report_image.thumbnailImageUrl
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {report?.hidden_report_likes?.length}
                    </TableCell>
                    <TableCell>
                      {report.hidden_report_orders.length}
                    </TableCell>
                    <TableCell>
                      {dayjs(report.created_at).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell>
                      {dayjs(report.expirationDate).format(
                        'YYYY-MM-DD',
                      )}
                    </TableCell>

                    <TableCell>
                      {openBannerList.filter(
                        (data) => data.id === report.id,
                      ).length === 0 ? (
                        <Button
                          variant="contained"
                          onClick={() => {
                            dispatch({
                              type: BannerListActionKind.CHANGE_OPEN_MODAL,
                              payload: true,
                            });
                            dispatch({
                              type: BannerListActionKind.CHANGE_POST_ID,
                              payload: report.id,
                            });
                          }}
                        >
                          등록
                        </Button>
                      ) : (
                        <Button color="secondary" variant="contained">
                          광고 중
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              variant="text"
              count={Math.ceil(
                bannerListState.reportsLength /
                  bannerListState.query._limit,
              )}
              page={bannerListState.page}
              onChange={(event, page) => {
                dispatch({
                  type: BannerListActionKind.CHANGE_PAGE,
                  payload: page,
                });
              }}
              style={{
                margin: '10px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            />
          </Box>
        </Scrollbar>
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={bannerListState.openModal}
        onClose={() => {
          dispatch({
            type: BannerListActionKind.CHANGE_OPEN_MODAL,
            payload: false,
          });
        }}
      >
        <ConfirmModal
          title={
            bannerListState.orderEdit
              ? '배너 목록을 수정하시겠습니까?'
              : '해당 리포트를 배너로 등록하시겠습니까?'
          }
          content={''}
          type={'CONFIRM'}
          confirmTitle={'등록'}
          handleOnClick={() => {
            bannerListState.orderEdit
              ? saveBanner()
              : postOneBanner();
          }}
          handleOnCancel={() => {
            dispatch({
              type: BannerListActionKind.CHANGE_OPEN_MODAL,
              payload: false,
            });
          }}
        />
      </Dialog>
    </>
  );
};

export default BannerListPresenter;
