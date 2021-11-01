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
import {
  IMasterListState,
  MasterListTableAction,
  MasterListTableActionKind,
} from './MasterListTable.Container';
import Scrollbar from 'src/components/layout/Scrollbar';

interface IMasterListTableProps {
  newState: IMasterListState;
  dispatch: (params: MasterListTableAction) => void;
  handleDelete: () => void;
}
const MasterListTablePresenter: React.FC<IMasterListTableProps> = (
  props,
) => {
  const { newState, dispatch, handleDelete } = props;

  return (
    <>
      <Card>
        {newState.loading && (
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
                  type: MasterListTableActionKind.CHANGE_QUERY,
                  payload: event.target.value,
                });
              }}
              placeholder="달인 검색"
              value={newState.query._q}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              mx: 1,
            }}
          >
            <TextField
              label={'채널 선택'}
              name="sort"
              onChange={(event) => {
                dispatch({
                  type: MasterListTableActionKind.CHANGE_CHANNEL,
                  payload: event.target.value,
                });
              }}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              {newState.list.channel.length > 0 ? (
                newState.list.channel.map((channel) => (
                  //@ts-ignore
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))
              ) : (
                <option>채널이 없습니다.</option>
              )}
            </TextField>

            <TextField
              select
              label={'방 정렬'}
              name="sort"
              onChange={(event) => {
                console.log(event.target.value);
                dispatch({
                  type: MasterListTableActionKind.CHANGE_ROOM,
                  payload: event.target.value,
                });
              }}
              SelectProps={{ native: true }}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              {newState.list.room.length > 0 ? (
                newState.list.room.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title}
                  </option>
                ))
              ) : (
                <option>방이 없습니다</option>
              )}
            </TextField>
          </Box>
        </Box>
        {newState.selected && (
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
                    type: MasterListTableActionKind.OPEN_DELETE_DIALOG,
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
        )}
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
                {!newState.loading &&
                  newState.list.feed.map((feed) => {
                    const isMasterSelected =
                      newState.selected === feed.id;

                    return (
                      <TableRow hover key={feed.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            value={isMasterSelected}
                            checked={isMasterSelected}
                            color="primary"
                            onChange={(event) => {
                              dispatch({
                                type: MasterListTableActionKind.SELECT_FEED,
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
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <Pagination
          count={Math.ceil(newState.list.feedLength / 20)}
          variant="outlined"
          onChange={(event, page) => {
            dispatch({
              type: MasterListTableActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={newState.delete.isDeleting}
        onClose={() =>
          dispatch({
            type: MasterListTableActionKind.CLOSE_DELETE_DIALOG,
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
              type: MasterListTableActionKind.CLOSE_DELETE_DIALOG,
            });
          }}
        />
      </Dialog>
    </>
  );
};

export default MasterListTablePresenter;
