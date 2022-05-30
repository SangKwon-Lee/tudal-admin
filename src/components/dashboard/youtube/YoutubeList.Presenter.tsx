import {
  Card,
  Divider,
  Box,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Pagination,
  Dialog,
  Link,
} from '@material-ui/core';
import dayjs from 'dayjs';
import Scrollbar from 'src/components/layout/Scrollbar';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import ArrowRightIcon from 'src/icons/ArrowRight';
import TrashIcon from 'src/icons/Trash';
import SearchIcon from 'src/icons/Search';
import { Link as RouterLink } from 'react-router-dom';
import {
  YoutubeListAction,
  YoutubeListActionKind,
  YoutubeListState,
} from './YoutubeList.Container';

interface YoutubeListProps {
  youtubeListState: YoutubeListState;
  dispatch: (params: YoutubeListAction) => void;
  handleDelete: () => Promise<void>;
}

const YoutubeListPresenter: React.FC<YoutubeListProps> = ({
  dispatch,
  handleDelete,
  youtubeListState,
}) => {
  const { loading, query, list, listLength } = youtubeListState;

  return (
    <>
      <Card sx={{ my: 3 }}>
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
              id="search"
              InputProps={{
                //@ts-ignore
                'data-testid': 'search-1231231',
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={(event) => {
                dispatch({
                  type: YoutubeListActionKind.CHANGE_QUERY,
                  payload: event.target.value,
                });
              }}
              placeholder="검색"
              value={query._q}
              variant="outlined"
            />
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>링크</TableCell>
                  <TableCell>등록일</TableCell>
                  {/* <TableCell>최종수정일</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  list.map((list) => {
                    // const isSelected = selected.includes(list.id);
                    return (
                      <TableRow
                        hover
                        key={list.id}
                        // selected={isSelected}
                      >
                        <TableCell>{list.id}</TableCell>
                        <TableCell>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/dashboard/youtube/${list.id}/edit`}
                            variant="subtitle2"
                          >
                            {list.title
                              ? list.title
                              : '제목이 없습니다.'}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {list.link ? list.link : '링크가 없습니다.'}
                        </TableCell>
                        <TableCell>
                          {dayjs(list.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}
                        </TableCell>

                        <TableCell>
                          <IconButton
                            component={RouterLink}
                            to={`/dashboard/youtube/${list.id}/edit`}
                          >
                            <ArrowRightIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              dispatch({
                                type: YoutubeListActionKind.SELECT_FEED,
                                payload: list.id,
                              });
                              dispatch({
                                type: YoutubeListActionKind.OPEN_DELETE_DIALOG,
                              });
                            }}
                          >
                            <TrashIcon fontSize="small" />
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
          count={Math.ceil(listLength / 20)}
          variant="outlined"
          onChange={(event, page) => {
            dispatch({
              type: YoutubeListActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={youtubeListState.delete.isDeleting}
        onClose={() =>
          dispatch({
            type: YoutubeListActionKind.CLOSE_DELETE_DIALOG,
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
              type: YoutubeListActionKind.CLOSE_DELETE_DIALOG,
            });
          }}
        />
      </Dialog>
    </>
  );
};
export default YoutubeListPresenter;
