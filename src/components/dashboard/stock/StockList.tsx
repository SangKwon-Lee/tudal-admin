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
  Button,
  Divider,
  Collapse,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Tooltip,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import SearchIcon from 'src/icons/Search';
import { applySort, applyPagination } from 'src/utils/pagination';
import dayjs from 'dayjs';
import * as _ from 'lodash';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import Table11 from 'src/components/widgets/tables/Table11';
import Table7 from 'src/components/widgets/tables/Table7';
import ExternalLinkIcon from '../../../icons/ExternalLink';
import InformationCircleIcon from '../../../icons/InformationCircle';

import AcademicCapIcon from '../../../icons/AcademicCap';
import BriefcaseIcon from '../../../icons/Briefcase';
import HomeIcon from '../../../icons/Home';
import MailIcon from '../../../icons/Mail';
import Scrollbar from '../../layout/Scrollbar';
import { lineHeight } from '@material-ui/system';

interface StockListProps {
  page: number;
  limit: number;
  search: string;
  list: IStockDetailsWithTagCommentNews[];
  loading: boolean;
  setPage: (event: any, newPage: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (value) => void;
  setTarget: (stock: IStockDetailsWithTagCommentNews) => void;
  setOpen: () => void;
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

const styles = {
  text: {
    width: '500px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

const useStyles = makeStyles({
  text: {
    cursor: 'pointer',
    width: '500px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      whiteSpace: 'pre',
    },
  },
});

const StockList: React.FC<StockListProps> = (props) => {
  const classes = useStyles();
  const {
    list,
    loading,
    search,
    limit,
    page,
    setPage,
    setLimit,
    setSearch,
    setTarget,
    setOpen,
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
      data-testid="stock-list-table"
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
      {/* {paginatedList.map((stock, i) => (
        <Card
          key={i}
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
                  {_.isEmpty(stock.tags) ? (
                    <Box
                      sx={{
                        px: 3,
                      }}
                    >
                      <Typography variant="body1" fontSize={15}>
                        관련 키워드가 없습니다.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Divider />
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexWrap: 'wrap',
                          p: 2,
                        }}
                      >
                        {stock.tags.map((tag, i) => {
                          return (
                            <Chip
                              key={i}
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
                      <Divider />
                    </>
                  )}
                </Box>
              </Box>
            }
            title={
              <>
                <Typography
                  color="textPrimary"
                  variant="h5"
                  fontSize={20}
                >
                  {`${stock.name} (${stock.code})`}
                </Typography>
                <Typography
                  variant="overline"
                  color="textSecondary"
                  fontSize={15}
                >
                  키워드
                </Typography>{' '}
                <Typography variant="overline" color="textSecondary">
                  (최신 업데이트 순)
                </Typography>
              </>
            }
          />
          <CardContent>
            <Typography
              variant="overline"
              color="textSecondary"
              fontSize={15}
            >
              관련 뉴스
            </Typography>
            <Typography variant="overline" color="textSecondary">
              (선택 뉴스, 최신 순)
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
                .map((entity, i) => {
                  return (
                    <Box
                      key={i}
                      sx={{
                        pb: 2,
                        px: 3,
                      }}
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

            <Typography
              variant="overline"
              color="textSecondary"
              fontSize={15}
            >
              {' '}
              코멘트{' '}
            </Typography>
            <Typography variant="overline" color="textSecondary">
              (최신 순)
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
                    <pre>- {comment.message} </pre>
                    <Typography color="textSecondary" variant="body2">
                      {comment.author &&
                        `${dayjs(comment.updated_at).format(
                          'YYYY-MM-DD HH:mm',
                        )} | ${comment.author.username}`}
                    </Typography>
                  </Box>
                );
              })
            )}
            <Button
              color="primary"
              size="small"
              variant="contained"
              onClick={() => {
                setOpen();
                setTarget(stock);
              }}
            >
              수정
            </Button>
          </CardContent>
        </Card>
      ))} */}

      {paginatedList.map((stock, i) => {
        return (
          <Box display="flex" justifyContent="space-between" mb={10}>
            <Box style={{ flexBasis: '20%' }}>
              <Card style={{ height: '100%' }}>
                <CardHeader title={`${stock.name} (${stock.code})`} />
                <Divider />
                <CardContent style={{ lineHeight: 3 }}>
                  {_.isEmpty(stock.news) ? (
                    <Box style={{ height: '100%' }}>
                      <Typography variant="body1" fontSize={15}>
                        관련 키워드가 없습니다.
                      </Typography>
                    </Box>
                  ) : (
                    stock.tags.map((tag, i) => {
                      return (
                        <Chip
                          key={i}
                          label={tag.name}
                          sx={{
                            ':first-child': {
                              mr: 1,
                            },
                            '& + &': {
                              mr: 1,
                            },
                          }}
                          variant="outlined"
                        />
                      );
                    })
                  )}
                </CardContent>
                <Box
                  style={{
                    justifyContent: 'flex-end',
                    display: 'flex',
                    padding: '10px',
                  }}
                >
                  <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setOpen();
                      setTarget(stock);
                    }}
                  >
                    수정
                  </Button>
                </Box>
              </Card>{' '}
            </Box>

            <Box style={{ flexBasis: '78%' }}>
              <Box mb={3}>
                <Card>
                  <Divider />
                  <Scrollbar>
                    <Box sx={{ minWidth: 700 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              코멘트{' '}
                              <Tooltip title="커서를 올리면 본문이 확인됩니다.">
                                <InformationCircleIcon fontSize="small" />
                              </Tooltip>
                            </TableCell>
                            <TableCell>작성자</TableCell>
                            <TableCell>작성일</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stock.comments.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Typography
                                  color="textPrimary"
                                  variant="subtitle2"
                                  className={classes.text}
                                >
                                  {item.message}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {item.author.username}
                              </TableCell>
                              <TableCell>{item.updated_at}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Scrollbar>
                  <TablePagination
                    component="div"
                    count={[1, 2, 3].length}
                    onPageChange={(): void => {}}
                    onRowsPerPageChange={(): void => {}}
                    page={0}
                    rowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </Card>{' '}
              </Box>
              <Box>
                <Card>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>뉴스 제목</TableCell>
                        <TableCell>요약</TableCell>
                        <TableCell>발행 일시</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stock.news.map((item) => (
                        <TableRow
                          key={item.id}
                          sx={{
                            '&:last-child td': {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{ textDecoration: 'none' }}
                              >
                                <ExternalLinkIcon
                                  fontSize="small"
                                  sx={{
                                    color: 'text.secondary',
                                    cursor: 'pointer',
                                  }}
                                />
                              </a>
                              <Typography
                                color="textPrimary"
                                sx={{ ml: 2 }}
                                variant="body2"
                                style={{
                                  width: '100%',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                <TableCell>{item.title}</TableCell>
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                              className={classes.text}
                            >
                              {item.summarized}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {dayjs(item.updated_at).format(
                              'YYYY-MM-DD HH:mm',
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={[1, 2, 3].length}
                    onPageChange={(): void => {}}
                    onRowsPerPageChange={(): void => {}}
                    page={0}
                    rowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </Card>
              </Box>
            </Box>
          </Box>
        );
      })}
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
