import React, { ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  CircularProgress,
  Dialog,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import Label from '../../widgets/Label';
import SearchIcon from '../../../icons/Search';
import { Priority, Schedule } from '../../../types/schedule';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import { INews } from 'src/types/news';

type Sort = 'publishDate|desc' | 'publishDate|asc';

interface SortOption {
  value: Sort;
  label: string;
}
const sortOptions: SortOption[] = [
  {
    label: '최신 등록순',
    value: 'publishDate|desc',
  },
  {
    label: '오래된 등록순',
    value: 'publishDate|asc',
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const applySort = (news: INews[], sort: Sort): INews[] => {
  const [orderBy, order] = sort.split('|') as [
    string,
    'asc' | 'desc',
  ];
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = news.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    // @ts-ignore
    return a[1] - b[1];
  });
  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

interface NewsListTableProps {
  newsList: any;
  search?: string;
  setSearch?: (value) => void;
  postDelete?: (id: number) => void;
  reload?: () => void;
}

const applyPagination = (
  news: INews[],
  page: number,
  limit: number,
): INews[] => news.slice(page * limit, page * limit + limit);

const NewsListTable: React.FC<NewsListTableProps> = (props) => {
  const { newsList, search, setSearch, postDelete, reload } = props;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [targetNews, setTargetNews] = useState<INews>(null);
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] =
    useState<boolean>(false);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleSort = (event): void => {
    setSort(event.target.value);
  };
  const sortedNewsList = applySort(newsList, sort);
  const paginatedNewsList = applyPagination(
    sortedNewsList,
    page,
    limit,
  );

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      <Card>
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
                id: '_q',
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              name={'_q'}
              placeholder="제목 또는 코멘트를 검색해주세요"
              onChange={(event) => setSearch(event.target.value)}
              variant="outlined"
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
              fullWidth
              label="정렬"
              id="sort"
              select
              onChange={(event) => handleSort(event)}
              SelectProps={{
                native: true,
              }}
              variant="outlined"
            >
              {sortOptions.map((sort, i) => {
                return (
                  <option
                    key={i}
                    value={sort.value}
                    data-testid="select-option"
                  >
                    {sort.label}
                  </option>
                );
              })}
            </TextField>
          </Box>
        </Box>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell width="30%">제목</TableCell>
                <TableCell width="50%">코멘트</TableCell>
                <TableCell width="10%">언론사</TableCell>
                <TableCell width="10%">출판일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody data-testid="news-table-list">
              {paginatedNewsList.map((news) => {
                const {
                  title,
                  tags,
                  id,
                  url,
                  mediaName,
                  summarized,
                  source,
                  publishDate,
                } = news;
                return (
                  <TableRow hover key={id}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" />
                    </TableCell>
                    <TableCell>
                      <Link
                        color="textPrimary"
                        underline="none"
                        variant="subtitle2"
                      >
                        {title}
                      </Link>
                    </TableCell>
                    <TableCell>{summarized}</TableCell>
                    <TableCell>
                      {mediaName ? mediaName : 'NA'}
                    </TableCell>
                    <TableCell data-testid="news-table-row-publish-date">{`${dayjs(
                      publishDate,
                    ).format('YYYY-MM-DD')}`}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setTargetNews(news);
                          setIsOpenDeleteConfirm(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={newsList.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
        {targetNews && (
          <Dialog
            aria-labelledby="ConfirmModal"
            open={isOpenDeleteConfirm}
            onClose={() => setIsOpenDeleteConfirm(false)}
          >
            <ConfirmModal
              title={`${targetNews.title} 일정을 삭제하시겠습니까?`}
              content={`삭제하면 되돌리기 어렵습니다.`}
              confirmTitle={'네 삭제합니다.'}
              handleOnClick={() => {
                postDelete(targetNews.id);
                setTargetNews(null);
              }}
              handleOnCancel={() => {
                setTargetNews(null);
                setIsOpenDeleteConfirm(false);
              }}
            />
          </Dialog>
        )}
      </Card>
    </Box>
  );
};

export default NewsListTable;

NewsListTable.propTypes = {
  newsList: PropTypes.array.isRequired,
};
