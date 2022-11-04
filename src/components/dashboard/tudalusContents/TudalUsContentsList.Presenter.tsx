import {
  Box,
  Card,
  InputAdornment,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  IconButton,
  Pagination,
  Button,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
// import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import Scrollbar from 'src/components/layout/Scrollbar';
import SearchIcon from 'src/icons/Search';
import TrashIcon from 'src/icons/Trash';
import ArrowRightIcon from 'src/icons/ArrowRight';
import { contentsList } from './TudalUsContentsList.Container';

interface TudalUsContentsListPresenterProps {
  query: {
    _q: string;
    _start: number;
    _limit: number;
    _sort: string;
  };
  page: number;
  listCount: number;
  contentsList: contentsList[];
  handleChangeQuery: (event: any) => void;
  handleChangePage: (event: number) => void;
  deleteTudalUsContents: (id: string | number) => Promise<void>;
  updateTudalUsContentsIsMain: (
    id: string | number,
    isMain: boolean,
  ) => Promise<void>;
}
const TudalUsContentsListPresenter = ({
  page,
  query,
  listCount,
  contentsList,
  handleChangePage,
  handleChangeQuery,
  deleteTudalUsContents,
  updateTudalUsContentsIsMain,
}: TudalUsContentsListPresenterProps) => {
  return (
    <Card sx={{ p: 3, mt: 3 }}>
      <Box sx={{ my: 2 }}>
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
          onChange={handleChangeQuery}
          placeholder="제목 검색"
          value={query._q}
          variant="outlined"
        />
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="center">메인</TableCell>
                <TableCell align="center">수정 & 삭제 </TableCell>
                {/* <TableCell>최종수정일</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {contentsList
                //@ts-ignore
                .sort((a, b) => b.isMain - a.isMain)
                .map((list) => {
                  return (
                    <TableRow hover key={list.id}>
                      <TableCell>{list.id}</TableCell>
                      <TableCell>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          to={`/dashboard/tudalus/contents/edit/${list.id}`}
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
                      <TableCell align="center">
                        {list.isMain ? (
                          <Button
                            variant="contained"
                            onClick={() => {
                              if (
                                window.confirm(
                                  '해당 게시글을 메인에서 내리시겠습니까?',
                                )
                              ) {
                                updateTudalUsContentsIsMain(
                                  list.id,
                                  list.isMain,
                                );
                              }
                            }}
                          >
                            메인에서 내리기
                          </Button>
                        ) : (
                          <Button
                            color="secondary"
                            onClick={() => {
                              if (
                                window.confirm(
                                  '해당 게시글을 메인으로 올리시겠습니까?',
                                )
                              ) {
                                updateTudalUsContentsIsMain(
                                  list.id,
                                  list.isMain,
                                );
                              }
                            }}
                          >
                            메인으로 올리기
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          component={RouterLink}
                          to={`/dashboard/tudalus/contents/edit/${list.id}`}
                        >
                          <ArrowRightIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (
                              window.confirm(
                                '정말로 삭제하시겠습니까?',
                              )
                            ) {
                              deleteTudalUsContents(list.id);
                            }
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          page={page}
          count={Math.ceil(listCount / 30)}
          variant="outlined"
          onChange={(event, page) => {
            handleChangePage(page);
          }}
        />
      </Box>
    </Card>
  );
};

export default TudalUsContentsListPresenter;
