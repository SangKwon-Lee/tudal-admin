import React, { useRef } from 'react';
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
  Pagination,
  TableRow,
  TextField,
  LinearProgress,
  Button,
  Divider,
  Typography,
  Dialog,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import SearchIcon from '../../../icons/Search';
import { INews } from 'src/types/news';
import {
  INewsListAction,
  INewsListState,
  NewsListActionKind,
  sortOptions,
} from './NewsList.Container';
dayjs.extend(customParseFormat);

interface NewsListPresenterProps {
  newsListState: INewsListState;
  formTarget: INews;
  updateSelect: () => void;
  setFormTarget: (news: INews) => void;
  setIsOpenForm: (isOpen: boolean) => void;
  dispatch: (params: INewsListAction) => void;
}

const useStyles = makeStyles({
  title: {
    color: '#0060B6',
    textDecoration: 'none',
    '&:hover': {
      color: 'blue',
    },
  },
});

const NewsListPresenter: React.FC<NewsListPresenterProps> = (
  props,
) => {
  const {
    newsListState,
    dispatch,
    setFormTarget,
    updateSelect,
    setIsOpenForm,
  } = props;
  const searchInput = useRef<HTMLInputElement>(null);
  const classes = useStyles();

  const { targetSelect } = newsListState;
  const handleSearch = () => {
    dispatch({
      type: NewsListActionKind.CHANGE_QUERY,
      payload: { name: '_q', value: searchInput.current.value },
    });
  };

  return (
    <Box sx={{ mt: 3 }} data-testid="news-list-table">
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
            name={'_q'}
            placeholder="제목 또는 요약본 검색 기능을 지원합니다."
            variant="outlined"
            inputRef={searchInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </Box>
        <Box>
          {' '}
          <Button variant={'contained'} onClick={handleSearch}>
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
            name="_sort"
            onChange={(e) => {
              dispatch({
                type: NewsListActionKind.CHANGE_QUERY,
                payload: {
                  name: e.target.name,
                  value: e.target.value,
                },
              });
            }}
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
            value={newsListState.minutesRefresh}
            onChange={(event) =>
              dispatch({
                type: NewsListActionKind.CHANGE_REFRESH_MINUTES,
                payload: parseInt(event.target.value, 10),
              })
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
        {newsListState.loading && (
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
            {newsListState.list.length > 0 &&
              newsListState.list.map((news, index) => (
                <TableRow
                  hover
                  key={index}
                  sx={{
                    '&:last-child td': {
                      border: 0,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Tooltip
                      title={
                        news.isSelectedBy && news.isSelected
                          ? `by ${news.isSelectedBy.nickname}`
                          : 'pick'
                      }
                      placement="bottom"
                    >
                      <Checkbox
                        color="primary"
                        checked={news.isSelected || false}
                        onClick={() => {
                          dispatch({
                            type: NewsListActionKind.SELECT_TARGET,
                            payload: news,
                          });
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
                    {news.summarized
                      .split('\n')
                      .map((sentence, i) => {
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
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
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
                        setFormTarget(news);
                        setIsOpenForm(true);
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
      <Pagination
        page={newsListState.page}
        onChange={(e, page) =>
          dispatch({
            type: NewsListActionKind.CHANGE_PAGE,
            payload: page,
          })
        }
        count={Math.ceil(
          newsListState.listLength / newsListState.query._limit,
        )}
        variant="outlined"
        shape="rounded"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      />
      <Dialog
        aria-labelledby="ConfirmModal"
        open={Boolean(newsListState.targetSelect)}
        onClose={() =>
          dispatch({
            type: NewsListActionKind.CLOSE_SELECT_CONFIRM,
          })
        }
      >
        {Boolean(newsListState.targetSelect) && (
          <ConfirmModal
            title={
              targetSelect.isSelected ? '뉴스 선택 취소' : '뉴스 선택'
            }
            content={
              targetSelect.isSelected
                ? '뉴스 선택을 취소하시겠습니까?'
                : '뉴스를 선택하시겠습니까?'
            }
            confirmTitle={targetSelect.isSelected ? '취소' : '추가'}
            type={targetSelect.isSelected ? 'ERROR' : 'CONFIRM'}
            handleOnClick={updateSelect}
            handleOnCancel={() =>
              dispatch({
                type: NewsListActionKind.CLOSE_SELECT_CONFIRM,
              })
            }
          />
        )}
      </Dialog>
    </Box>
  );
};

export default NewsListPresenter;
