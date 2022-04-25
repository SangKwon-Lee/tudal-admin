import {
  Box,
  Card,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import {
  SideBannerListAction,
  SideBannerListActionKind,
  SideBannerListState,
} from './SideBannerList.Container';
import SearchIcon from 'src/icons/Search';
import dayjs from 'dayjs';
import Scrollbar from 'src/components/layout/Scrollbar';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import { Link as RouterLink } from 'react-router-dom';
import ArrowRightIcon from 'src/icons/ArrowRight';
import TrashIcon from 'src/icons/Trash';
interface SideBannerListProps {
  sideBannerListState: SideBannerListState;
  dispatch: (params: SideBannerListAction) => void;
  getSideBannerList: () => void;
  handleDelete: () => Promise<void>;
}
const SideBannerListPresenter: React.FC<SideBannerListProps> = ({
  dispatch,
  handleDelete,
  getSideBannerList,
  sideBannerListState,
}) => {
  const { loading, query, list, listLength } = sideBannerListState;

  return (
    <>
      <Box sx={{ mb: 3 }}></Box>
      <Card>
        {loading && (
          <div data-testid="group-list-loading">
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
                  type: SideBannerListActionKind.CHANGE_QUERY,
                  payload: event.target.value,
                });
              }}
              placeholder="그룹 이름 검색"
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
                  <TableCell>이름</TableCell>
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
                            to={`/dashboard/sidebanner/${list.id}/edit`}
                            variant="subtitle2"
                          >
                            {list.title
                              ? list.title
                              : '제목이 없습니다.'}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {dayjs(list.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}
                        </TableCell>

                        <TableCell>
                          <IconButton
                            component={RouterLink}
                            to={`/dashboard/sidebanner/${list.id}/edit`}
                          >
                            <ArrowRightIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              dispatch({
                                type: SideBannerListActionKind.SELECT_FEED,
                                payload: list.id,
                              });
                              dispatch({
                                type: SideBannerListActionKind.OPEN_DELETE_DIALOG,
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
              type: SideBannerListActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={sideBannerListState.delete.isDeleting}
        onClose={() =>
          dispatch({
            type: SideBannerListActionKind.CLOSE_DELETE_DIALOG,
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
              type: SideBannerListActionKind.CLOSE_DELETE_DIALOG,
            });
          }}
        />
      </Dialog>
    </>
  );
};

export default SideBannerListPresenter;
