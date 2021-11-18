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
interface IBannerListProps {
  bannerListState: BannerListState;
  dispatch: (param: BannerListAction) => void;
  postOneBanner: (id: any) => void;
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
  const { bannerListState, dispatch, postOneBanner, moveCard } =
    props;
  const { reports, orderEdit, openBannerList } = bannerListState;
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
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch({
                    type: BannerListActionKind.CHANGE_ORDER_EDIT,
                    payload: false,
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
          {openBannerList.map((list, i) => (
            <DraggableCard
              key={i}
              id={list.id}
              index={i + 1}
              orderEdit={orderEdit}
              moveCard={moveCard}
              img={list.hidden_report_image.thumbnailImageUrl}
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
                      {report.hidden_report_likes.length}
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
                      <Button
                        id={String(report.id)}
                        variant="contained"
                        onClick={postOneBanner}
                      >
                        등록
                      </Button>
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
    </>
  );
};

export default BannerListPresenter;
