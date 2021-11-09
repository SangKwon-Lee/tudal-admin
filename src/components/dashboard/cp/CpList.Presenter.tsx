import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  LinearProgress,
  Pagination,
} from '@material-ui/core';
import ArrowRightIcon from 'src/icons/ArrowRight';
import PencilAltIcon from 'src/icons/PencilAlt';
import SearchIcon from 'src/icons/Search';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
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
const CpListPresenter: React.FC<CpListProps> = (props) => {
  const { cpListState, dispatch } = props;
  const { loading, user } = cpListState;
  return (
    <>
      <Card>
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
              onChange={() => {}}
              placeholder=""
              // value={newState.query._q}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              mx: 1,
            }}
          ></Box>
        </Box>
        {/* {newState.selected && (
          <Box sx={{ position: 'relative' }}>
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
                    type: CpListTableActionKind.OPEN_DELETE_DIALOG,
                  });
                }}
              >
                삭제
              </Button>
              <Button
                color="primary"
                sx={{ ml: 2 }}
                variant="outlined"
                component={RouterLink}
                to={`/dashboard/master/${newState.selected}/edit`}
              >
                수정
              </Button>
            </Box>
          </Box>
        )} */}
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell>수정일</TableCell>
                  <TableCell>방 이름</TableCell>
                  <TableCell>좋아요</TableCell>
                  <TableCell>조회수</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {!newState.loading &&
                  newState.list.feed.map((feed) => {
                    const isCpSelected =
                      newState.selected === feed.id;

                    return (
                      <TableRow hover key={feed.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            value={isCpSelected}
                            checked={isCpSelected}
                            color="primary"
                            onChange={(event) => {
                              dispatch({
                                type: CpListTableActionKind.SELECT_FEED,
                                payload: feed.id,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <Box sx={{ ml: 1, maxWidth: '150px' }}>
                              <Link
                                color="inherit"
                                component={RouterLink}
                                to={`/dashboard/master/${feed.id}`}
                                variant="subtitle2"
                              >
                                {feed.title
                                  ? feed.title
                                  : '제목이 없습니다.'}
                              </Link>
                              <Typography
                                color="textSecondary"
                                variant="body2"
                              >
                                {`${
                                  feed.master?.nickname ||
                                  '유저를 찾을 수 없습니다.'
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
                          {`${moment(feed.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}`}
                        </TableCell>
                        <TableCell>
                          {moment(feed.updated_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}
                        </TableCell>
                        <TableCell>
                          {feed.master_room?.title}
                        </TableCell>
                        <TableCell>
                          {feed.master_feed_likes.length}
                        </TableCell>
                        <TableCell>{feed.viewCount}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            component={RouterLink}
                            to={`/dashboard/master/${feed.id}/edit`}
                          >
                            <PencilAltIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            component={RouterLink}
                            to={`/dashboard/master/${feed.id}`}
                          >
                            <ArrowRightIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })} */}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <Pagination
          count={20}
          variant="outlined"
          onChange={(event, page) => {}}
        />
      </Card>
      {/* <Dialog
        aria-labelledby="ConfirmModal"
        open={newState.delete.isDeleting}
        onClose={() =>
          dispatch({
            type: CpListTableActionKind.CLOSE_DELETE_DIALOG,
          })
        }
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={'삭제시 큰 주의가 필요합니다.'}
          confirmTitle={'삭제'}
          handleOnClick={handleDelete}
          handleOnCancel={() => {
            dispatch({
              type: CpListTableActionKind.CLOSE_DELETE_DIALOG,
            });
          }}
        />
      </Dialog> */}
    </>
  );
};

export default CpListPresenter;
