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
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Tooltip,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import SearchIcon from 'src/icons/Search';
import { applyPagination } from 'src/utils/pagination';
import dayjs from 'dayjs';
import * as _ from 'lodash';
import ExternalLinkIcon from '../../../icons/ExternalLink';
import InformationCircleIcon from '../../../icons/InformationCircle';
import Scrollbar from '../../layout/Scrollbar';
import {
  StockListAction,
  StockListActionKind,
  StockListState,
} from './StockList.Container';
import StockFormContainer from './StockFormModal.Container';
import { getUniqueListBy } from 'src/utils/helper';

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

interface StockListProps {
  stockState: StockListState;
  dispatch: (params: StockListAction) => void;
  reloadStock: (stock?: any) => void;
  handlePageChange: (event: any, newPage: number) => void;
  loadStock: () => Promise<void>;
}

const StockListPresenter: React.FC<StockListProps> = (props) => {
  const {
    stockState,
    dispatch,
    reloadStock,
    handlePageChange,
    loadStock,
  } = props;
  const {
    isOpenForm,
    loading,
    query,
    stocks,
    targetStock,
    page,
    commentPage,
    newsPage,
  } = stockState;

  const classes = useStyles();

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        p: 3,
      }}
      data-testid="stock-list-table"
    >
      {isOpenForm && !_.isEmpty(targetStock) && (
        <StockFormContainer
          stock={targetStock}
          isOpen={isOpenForm}
          reloadStock={reloadStock}
          setClose={() =>
            dispatch({ type: StockListActionKind.CLOSE_FORM })
          }
        />
      )}
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
            placeholder="종목명 검색을 지원합니다."
            onKeyPress={(e) => e.key === 'Enter' && loadStock()}
            onChange={_.debounce((event) => {
              dispatch({
                type: StockListActionKind.CHANGE_QUERY,
                payload: event.target.value,
              });
            }, 80)}
            variant="outlined"
          />
        </Box>
        <Button variant={'contained'} onClick={loadStock}>
          검색
        </Button>
      </Box>

      {loading && (
        <div data-testid="stock-list-loading">
          <LinearProgress />
        </div>
      )}

      {stockState.stocks.map((stock, i) => {
        const paginatedComments = applyPagination(
          stock.comments,
          commentPage,
          3,
        );
        const paginatedNews = applyPagination(
          stock.news,
          newsPage,
          3,
        );

        const stockTags = getUniqueListBy(
          stock.tags.slice(0, 20).filter((tag) => tag.name),
          'tag_id',
        );
        return (
          <Box
            display="flex"
            justifyContent="space-between"
            mb={10}
            key={i}
            data-testid={`stock-list-${stock.code}`}
          >
            <Box style={{ flexBasis: '20%' }}>
              <Card style={{ height: '100%' }}>
                <CardHeader title={`${stock.name} (${stock.code})`} />
                <Divider />
                <CardContent style={{ lineHeight: 3 }}>
                  {_.isEmpty(stock.tags) ? (
                    <Box style={{ height: '100%' }}>
                      <Typography variant="body1" fontSize={15}>
                        관련 키워드가 없습니다.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {stockTags.map((tag, i) => {
                        return (
                          <Chip
                            key={i}
                            data-testid="stock-list-keyword"
                            label={tag.name}
                            sx={{
                              ':first-of-type': {
                                mr: 1,
                              },
                              '& + &': {
                                mr: 1,
                              },
                            }}
                            variant="outlined"
                          />
                        );
                      })}
                      <Typography variant="body1" fontSize={12}>
                        상위 20개의 항목만 보여지고 있습니다.
                      </Typography>
                    </>
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
                      dispatch({
                        type: StockListActionKind.SHOW_FORM,
                      });
                      dispatch({
                        type: StockListActionKind.SET_TARGET,
                        payload: stock,
                      });
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
                          {_.isEmpty(paginatedComments) ? (
                            <TableRow>
                              <TableCell>
                                <Typography variant={'body1'}>
                                  {'작성된 코멘트가 없습니다.'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedComments.map((item, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  <Typography
                                    color="textPrimary"
                                    variant="subtitle2"
                                    className={classes.text}
                                    data-testid="stock-list-comment-row"
                                  >
                                    {item.message}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {item.author
                                    ? item.author.username
                                    : 'NA'}
                                </TableCell>
                                <TableCell>
                                  {dayjs(item.created_at).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Scrollbar>
                  <TablePagination
                    component="div"
                    count={stock.comments.length}
                    onPageChange={(event, value) => {
                      dispatch({
                        type: StockListActionKind.CHANGE_COMMENTPAGE,
                        payload: value,
                      });
                    }}
                    page={commentPage}
                    rowsPerPage={3}
                    rowsPerPageOptions={[3]}
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
                      {_.isEmpty(paginatedNews) ? (
                        <TableRow>
                          <TableCell>
                            <Typography variant={'body1'}>
                              {'연관된 뉴스가 없습니다.'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedNews.map((item, i) => (
                          <TableRow
                            key={i}
                            data-testid="stock-list-news-row"
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
                                >
                                  {item.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography
                                color="textPrimary"
                                variant="body2"
                                className={classes.text}
                              >
                                {item.summarized}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {dayjs(item.publishDate).format(
                                'YYYY-MM-DD HH:mm',
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={stock.news.length}
                    onPageChange={(event, value): void =>
                      dispatch({
                        type: StockListActionKind.CHANGE_NEWSPAGE,
                        payload: value,
                      })
                    }
                    page={newsPage}
                    rowsPerPage={3}
                    rowsPerPageOptions={[3]}
                  />
                </Card>
              </Box>
            </Box>
          </Box>
        );
      })}
      <TablePagination
        component="div"
        count={stocks.length}
        onPageChange={handlePageChange}
        page={page}
        rowsPerPage={query._limit}
        rowsPerPageOptions={[10]}
      />
    </Box>
  );
};

export default StockListPresenter;
