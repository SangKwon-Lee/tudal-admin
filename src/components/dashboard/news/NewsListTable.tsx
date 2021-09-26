import React, { ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  Box,
  Card,
  Tooltip,
  Chip,
  Table,
  Checkbox,
  TableBody,
  InputAdornment,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  LinearProgress,
  Button,
  Divider,
  Typography,
} from '@material-ui/core';
import * as _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

import SearchIcon from '../../../icons/Search';
import { INews } from 'src/types/news';
dayjs.extend(customParseFormat);

type Sort =
  | 'publishDate|desc'
  | 'publishDate|asc'
  | 'isSelected|desc';

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
  {
    label: '선택한 뉴스순',
    value: 'isSelected|desc',
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
  newsList: INews[];
  search: React.Ref<HTMLInputElement>;
  page: number;
  limit: number;
  isLoading: boolean;
  isOpenForm: boolean;
  minutesRefresh: number;
  setOpenForm: () => void;
  setPage: (event: any, newPage: number) => void;
  setLimit: (limit: number) => void;
  setTargetNews: (INews) => void;
  setOpenConfirm: () => void;
  setMinutesRefresh: (minutes: number) => void;
  postDelete?: (id: number) => void;
  reload?: () => void;
}

const applyPagination = (
  news: INews[],
  page: number,
  limit: number,
): INews[] => news.slice(page * limit, page * limit + limit);

const useStyles = makeStyles({
  title: {
    color: '#0060B6',
    textDecoration: 'none',
    '&:hover': {
      color: 'blue',
    },
  },
});

const NewsListTable: React.FC<NewsListTableProps> = (props) => {
  const classes = useStyles();
  const {
    newsList,
    search,
    page,
    limit,
    isLoading,
    minutesRefresh,
    reload,
    setLimit,
    setPage,
    setOpenConfirm,
    setTargetNews,
    setOpenForm,
    setMinutesRefresh,
  } = props;
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);

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
      data-testid="news-list-table"
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          paddingBottom: 3,
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 600,
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              id: 'search',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            inputRef={search}
            name={'_q'}
            placeholder="제목 또는 요약본 검색 기능을 지원합니다."
            variant="outlined"
            onKeyPress={(e) => {
              e.key === 'Enter' && reload();
            }}
          />
        </Box>
        <Box>
          {' '}
          <Button variant={'contained'} onClick={reload}>
            검색
          </Button>
        </Box>
        <div style={{ width: '100%' }}></div>
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
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240,
          }}
        >
          <TextField
            fullWidth
            label="새로고침 시간"
            select
            value={minutesRefresh}
            onChange={(event) =>
              setMinutesRefresh(parseInt(event.target.value, 10))
            }
            SelectProps={{
              native: true,
            }}
            variant="outlined"
          >
            <option value={1}>1 분</option>
            <option value={3}>3 분</option>
            <option value={5}>5 분</option>
            <option value={10}>10 분</option>
          </TextField>
        </Box>
      </Box>
      <Card>
        {isLoading && (
          <div data-testid="news-list-loading">
            <LinearProgress />
          </div>
        )}
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%">PICK</TableCell>
              <TableCell width="60%">제목 / 본문 요약</TableCell>
              <TableCell width="10%">언론사</TableCell>
              <TableCell width="20%">발행일</TableCell>
              <TableCell width="5%"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid="news-table-list">
            {paginatedNewsList.map((news) => (
              <TableRow
                hover
                key={news.id}
                sx={{
                  '&:last-child td': {
                    border: 0,
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Tooltip
                    title={
                      news.isSelectedBy
                        ? `by ${news.isSelectedBy.nickname}`
                        : 'pick'
                    }
                    placement="bottom"
                  >
                    <Checkbox
                      color="primary"
                      checked={news.isSelected}
                      onClick={() => {
                        setTargetNews(news);
                        setOpenConfirm();
                      }}
                    />
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Typography
                    sx={{ cursor: 'pointer' }}
                    className={classes.title}
                    color="textPrimary"
                    variant="subtitle2"
                    fontSize={18}
                    fontWeight={news.isSelected ? 'bold' : 'normal'}
                  >
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      {news.title}
                    </a>
                  </Typography>
                  {news.summarized.split('\n').map((sentence, i) => {
                    return (
                      <div key={i}>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          fontSize={15}
                          fontWeight={
                            news.isSelected ? 'bold' : 'normal'
                          }
                        >
                          {sentence}
                        </Typography>
                      </div>
                    );
                  })}
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      mt: 1,
                      flexWrap: 'wrap',
                      alignContent: 'space-between',
                    }}
                  >
                    {Array.isArray(news.tags) &&
                      news.tags.length > 0 &&
                      news.tags.map((tag) => (
                        <React.Fragment key={tag.id}>
                          <Box marginRight={1} />
                          <Chip color="default" label={tag.name} />
                        </React.Fragment>
                      ))}

                    {Array.isArray(news.stocks) &&
                      news.stocks.length > 0 &&
                      news.stocks.map((stock, i) => (
                        <React.Fragment key={i}>
                          <Box marginRight={1} />
                          <Chip
                            color="primary"
                            //@ts-ignore
                            label={stock.keyword}
                          />
                        </React.Fragment>
                      ))}
                    {Array.isArray(news.categories) &&
                      news.categories.length > 0 &&
                      news.categories.map((category, i) => (
                        <React.Fragment key={i}>
                          <Box marginRight={1} />
                          <Chip
                            color="secondary"
                            label={category.name}
                          />
                        </React.Fragment>
                      ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                    fontSize={15}
                  >
                    {news.mediaName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    {dayjs(news.publishDate).format(
                      'YYYY-MM-DD HH:mm',
                    )}
                  </Typography>
                </TableCell>

                <TableCell align="left">
                  <Button
                    color="primary"
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setOpenForm();
                      setTargetNews(news);
                    }}
                  >
                    수정
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <TablePagination
        component="div"
        count={newsList.length}
        onPageChange={setPage}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Box>
  );
};

export default NewsListTable;

NewsListTable.propTypes = {
  newsList: PropTypes.array.isRequired,
};
