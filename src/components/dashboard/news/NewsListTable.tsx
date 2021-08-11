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
  LinearProgress,
  Button,
  CardHeader,
  Divider,
  Typography,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '../../../icons/Search';
import { Priority, Schedule } from '../../../types/schedule';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import { INews } from 'src/types/news';
import Label from 'src/components/widgets/Label';

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
  newsList: INews[];
  search: string;
  isLoading: boolean;
  setSearch?: (value) => void;
  postDelete?: (id: number) => void;
  reload?: () => void;
}

const applyPagination = (
  news: INews[],
  page: number,
  limit: number,
): INews[] => news.slice(page * limit, page * limit + limit);

const labelColorsMap = {
  draft: 'secondary',
  active: 'success',
  stopped: 'error',
};

const randomColor = () => {
  let hex = Math.floor(Math.random() * 0xffffff);
  let color = '#' + hex.toString(16);

  return color;
};

const NewsListTable: React.FC<NewsListTableProps> = (props) => {
  const {
    newsList,
    search,
    setSearch,
    postDelete,
    reload,
    isLoading,
  } = props;
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
    // <Box
    //   sx={{
    //     backgroundColor: 'background.default',
    //   }}
    //   data-testid="news-list-table"
    // >
    // //<Card>
    // //     <Box
    //       sx={{
    //         alignItems: 'center',
    //         display: 'flex',
    //         flexWrap: 'wrap',
    //         m: -1,
    //         p: 2,
    //       }}
    //     >
    //   <Box
    //     sx={{
    //       m: 1,
    //       maxWidth: '100%',
    //       width: 500,
    //     }}
    //   >
    //     <TextField
    //       fullWidth
    //       InputProps={{
    //         id: '_q',
    //         startAdornment: (
    //           <InputAdornment position="start">
    //             <SearchIcon fontSize="small" />
    //           </InputAdornment>
    //         ),
    //       }}
    //       name={'_q'}
    //       placeholder="제목 또는 코멘트를 검색해주세요"
    //       onChange={(event) => setSearch(event.target.value)}
    //       variant="outlined"
    //     />
    //   </Box>
    //   <Box
    //     sx={{
    //       m: 1,
    //       maxWidth: '100%',
    //       width: 240,
    //     }}
    //   >
    //     <TextField
    //       fullWidth
    //       label="정렬"
    //       id="sort"
    //       select
    //       onChange={(event) => handleSort(event)}
    //       SelectProps={{
    //         native: true,
    //       }}
    //       variant="outlined"
    //     >
    //       {sortOptions.map((sort, i) => {
    //         return (
    //           <option
    //             key={i}
    //             value={sort.value}
    //             data-testid="select-option"
    //           >
    //             {sort.label}
    //           </option>
    //         );
    //       })}
    //     </TextField>
    //   </Box>
    // </Box>
    //     <Box>
    //       <Table>
    // <TableHead>
    //   <TableRow>
    //     <TableCell padding="checkbox"></TableCell>
    //     <TableCell width="30%">제목</TableCell>
    //     <TableCell width="50%">기사(요약)</TableCell>
    //     <TableCell width="10%">언론사</TableCell>
    //     <TableCell width="10%">출판일</TableCell>
    //   </TableRow>
    // </TableHead>
    //         <TableBody data-testid="news-table-list">
    //           {paginatedNewsList.map((news) => {
    //             const {
    //               title,
    //               id,
    //               mediaName,
    //               summarized,
    //               publishDate,
    //             } = news;
    //             return (
    //               <TableRow hover key={id}>
    //                 <TableCell padding="checkbox">
    //                   <Checkbox color="primary" />
    //                 </TableCell>
    //                 <TableCell>
    //                   <Link
    //                     color="textPrimary"
    //                     underline="none"
    //                     variant="subtitle2"
    //                   >
    //                     {title}
    //                   </Link>
    //                 </TableCell>
    //                 <TableCell>{summarized}</TableCell>
    //                 <TableCell>
    //                   {mediaName ? mediaName : 'NA'}
    //                 </TableCell>
    //                 <TableCell data-testid="news-table-row-publish-date">{`${dayjs(
    //                   publishDate,
    //                 ).format('YYYY-MM-DD')}`}</TableCell>
    //                 <TableCell align="right">
    //                   <IconButton
    //                     onClick={() => {
    //                       setTargetNews(news);
    //                       setIsOpenDeleteConfirm(true);
    //                     }}
    //                   >
    //                     <DeleteIcon fontSize="small" />
    //                   </IconButton>
    //                 </TableCell>
    //               </TableRow>
    //             );
    //           })}
    //         </TableBody>
    //       </Table>
    //     </Box>
    // <TablePagination
    //   component="div"
    //   count={newsList.length}
    //   onPageChange={handlePageChange}
    //   onRowsPerPageChange={handleLimitChange}
    //   page={page}
    //   rowsPerPage={limit}
    //   rowsPerPageOptions={[5, 10, 25]}
    // />
    //     {targetNews && (
    //       <Dialog
    //         aria-labelledby="ConfirmModal"
    //         open={isOpenDeleteConfirm}
    //         onClose={() => setIsOpenDeleteConfirm(false)}
    //       >
    //         <ConfirmModal
    //           title={`${targetNews.title} 일정을 삭제하시겠습니까?`}
    //           content={`삭제하면 되돌리기 어렵습니다.`}
    //           confirmTitle={'네 삭제합니다.'}
    //           handleOnClick={() => {
    //             postDelete(targetNews.id);
    //             setTargetNews(null);
    //           }}
    //           handleOnCancel={() => {
    //             setTargetNews(null);
    //             setIsOpenDeleteConfirm(false);
    //           }}
    //         />
    //       </Dialog>
    //     )}
    //   </Card>
    // </Box>

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
              <TableCell width="60%">제목/기사(요약)</TableCell>
              <TableCell>언론사</TableCell>
              <TableCell>출판일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid="news-table-list">
            {paginatedNewsList.map((news) => (
              <TableRow
                key={news.id}
                sx={{
                  '&:last-child td': {
                    border: 0,
                  },
                }}
              >
                <TableCell>
                  <Typography
                    color="textPrimary"
                    sx={{ cursor: 'pointer' }}
                    variant="subtitle2"
                    fontSize={18}
                  >
                    {news.title}
                  </Typography>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      mt: 1,
                    }}
                  >
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      fontSize={15}
                    >
                      {news.summarized}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      mt: 1,
                    }}
                  >
                    {Array.isArray(news.tags) &&
                      news.tags.length > 0 &&
                      news.tags.map((tag) => (
                        <Label key={tag.id}>{tag.name}</Label>
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
                    {dayjs(news.publishDate).format('YYYY-MM-DD')}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Button
                    color="primary"
                    size="small"
                    variant="outlined"
                  >
                    View
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
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default NewsListTable;

NewsListTable.propTypes = {
  newsList: PropTypes.array.isRequired,
};
