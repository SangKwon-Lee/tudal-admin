import React, { useState } from 'react';
import { formatDistanceToNowStrict, subHours } from 'date-fns';
import {
  Chip,
  Box,
  Card,
  CardHeader,
  LinearProgress,
  InputAdornment,
  TextField,
  Typography,
  TablePagination,
  CardContent,
} from '@material-ui/core';
import SearchIcon from 'src/icons/Search';
import { applySort, applyPagination } from 'src/utils/pagination';
import dayjs from 'dayjs';
import * as _ from 'lodash';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';

interface StockListProps {
  page: number;
  limit: number;
  search: string;
  list: IStockDetailsWithTagCommentNews[];
  loading: boolean;
  setPage: (event: any, newPage: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (value) => void;
  reload: () => void;
}

type Sort = 'id|asc' | 'updated_at|desc';

interface SortOption {
  value: Sort;
  label: string;
}
const sortOptions: SortOption[] = [
  {
    label: '이름 순',
    value: 'id|asc',
  },
  {
    label: '최신 등록순',
    value: 'updated_at|desc',
  },
];

const StockList: React.FC<StockListProps> = (props) => {
  const {
    list,
    loading,
    search,
    limit,
    page,
    setPage,
    setLimit,
    setSearch,
    reload,
  } = props;
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);

  const sortedList = applySort(list, sort);
  const paginatedList = applyPagination(sortedList, page, limit);
  const handleSearch = _.debounce(setSearch, 300);

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        p: 3,
      }}
      data-i="stock-lilist-rowst"
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
            placeholder="제목 또는 요약본 검색 기능을 지원합니다."
            onChange={(event) => handleSearch(event.target.value)}
            variant="outlined"
          />
        </Box>
      </Box>

      {loading && (
        <div data-testid="stock-list-loading">
          <LinearProgress />
        </div>
      )}
      {paginatedList.map((stock, i) => (
        <Card
          key={stock.code}
          sx={{
            '& + &': {
              mt: 2,
            },
          }}
          data-testid={'stock-list-row'}
        >
          <CardHeader
            disableTypography
            subheader={
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {stock.tags.map((tag) => {
                    return (
                      <Chip
                        // onDelete={(): void => {
                        //   const newTags = values.tags.filter(
                        //     (t) => t !== _tag,
                        //   );

                        //   setFieldValue('tags', newTags);
                        // }}
                        // eslint-disable-next-line react/no-array-index-key
                        key={tag.id}
                        label={tag.name}
                        sx={{
                          '& + &': {
                            ml: 1,
                          },
                        }}
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              </Box>
            }
            title={
              <Typography
                color="textPrimary"
                sx={{ ml: 1 }}
                variant="h5"
                fontSize={20}
              >
                {`${stock.id} ${stock.name} (${stock.code})`}
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="h6" fontSize={18}>
              관련 뉴스
            </Typography>

            {_.isEmpty(stock.news) ? (
              <Box
                sx={{
                  pb: 2,
                  px: 3,
                }}
              >
                <Typography variant="body1" fontSize={15}>
                  관련 뉴스가 없습니다.
                </Typography>
              </Box>
            ) : (
              stock.news
                .filter((entity) => entity !== null)
                .map((entity) => {
                  return (
                    <Box
                      sx={{
                        pb: 2,
                        px: 3,
                      }}
                      key={entity.id}
                    >
                      <Typography
                        variant="h6"
                        fontSize={15}
                        color="textPrimary"
                      >
                        <a
                          href={entity.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: 'underline',
                            color: 'inherit',
                          }}
                        >
                          - {entity.title}{' '}
                        </a>
                      </Typography>
                      <Typography variant="body1" fontSize={15}>
                        {entity.summarized}{' '}
                      </Typography>
                    </Box>
                  );
                })
            )}

            <Typography variant="h6" fontSize={18}>
              코멘트
            </Typography>
            {_.isEmpty(stock.comments) ? (
              <Box
                sx={{
                  pb: 2,
                  px: 3,
                }}
              >
                <Typography variant="body1" fontSize={15}>
                  관련 코멘트가 없습니다.
                </Typography>
              </Box>
            ) : (
              stock.comments.map((comment) => {
                return (
                  <Box
                    key={comment.id}
                    sx={{
                      pb: 2,
                      px: 3,
                    }}
                  >
                    <Typography variant="body1" fontSize={15}>
                      <pre>{comment.message} </pre>
                      {comment.author &&
                        `by ${comment.author.username}`}
                    </Typography>
                  </Box>
                );
              })
            )}
          </CardContent>
        </Card>
      ))}
      <TablePagination
        component="div"
        count={list.length}
        onPageChange={setPage}
        onRowsPerPageChange={() => console.log('hell')}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Box>
  );
};

export default StockList;
