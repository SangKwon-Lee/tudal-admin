import React, { useState, useCallback, ChangeEvent } from 'react';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import {
  Dialog,
  Divider,
  Button,
  Grid,
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  LinearProgress,
  Chip,
  Typography,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  TableBody,
  TablePagination,
  FormControlLabel,
  Switch,
  CardActions,
} from '@material-ui/core';

import Scrollbar from '../../layout/Scrollbar';
import InformationCircleIcon from '../../../icons/InformationCircle';
import ExternalLinkIcon from '../../../icons/ExternalLink';

import { makeStyles } from '@material-ui/core/styles';

import {
  tokenize,
  extractStocks,
  extractKeywords,
} from 'src/utils/extractKeywords';

import * as _ from 'lodash';
import { FixtureStocks } from 'src/fixtures';
import useAsync from 'src/hooks/useAsync';
import { Stock, Tag } from 'src/types/schedule';
import { APINews, APIStock, APITag } from 'src/lib/api';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import { IRoleType } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import { applyPagination } from 'src/utils/pagination';
import { Action } from 'history';

const tagFilter = createFilterOptions<any>();

interface StockFormProps {
  stock: IStockDetailsWithTagCommentNews;
  isOpen: boolean;
  postStockComment: (
    message: string,
    stock: string,
    dateTime: string,
  ) => void;
  reloadElement: (id: string) => void;
  setClose: () => void;
}

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

const newsManualFormInit = {
  title: '',
  url: '',
  mediaName: '',
  publishDate: dayjs(),
  summarized: '',
};
const StockForm: React.FC<StockFormProps> = (props) => {
  const { user } = useAuth();
  const { stock, isOpen, setClose, reloadElement, postStockComment } =
    props;
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [newsUrl, setNewsUrl] = useState('');

  const [newsManualForm, setNewsManualForm] = useState(
    newsManualFormInit,
  );
  const [newsFormType, setNewsFormType] = useState(true); // false: 자동등록, true: 수동등록

  const [commentDate, setCommentDate] = useState(dayjs());
  const [newsPubDate, setNewsPubDate] = useState(dayjs());
  const [commentPage, setCommentPage] = useState<number>(0);
  const [newsPage, setNewsPage] = useState<number>(0);

  const classes = useStyles();

  const [{ data: tagList, loading: tagLoading }] = useAsync<Tag[]>(
    () => APITag.getList(tagInput),
    [tagInput],
    [],
  );

  const createOrUpdateTag = useCallback(
    async (stock, tag) => {
      const { data, status } = await APIStock.updateStockTag(
        stock.code,
        tag.name,
      );

      if (status === 200) {
        alert('성공하였습니다');
        reloadElement(stock.code);
      }
    },
    [reloadElement],
  );

  const createOrSelectByUrl = async () => {
    try {
      const { data, status } = await APINews.createAndSelectByURL(
        newsUrl,
        newsPubDate.toISOString(),
        stock.code,
        user.id,
      );

      if (status === 200) {
        if (data.isExisted) {
          alert(
            '기존에 등록되어 있던 뉴스입니다. 기존 뉴스를 선택합니다.',
          );
        } else {
          alert('등록되었습니다');
        }
        reloadElement(stock.code);
      }
      setNewsUrl('');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const createAndSelectByHand = async () => {
    try {
      const { data: news } = await APINews.createAndSelectByHand(
        newsManualForm,
        user.id,
      );

      if (news && news.id) {
        const { status } = await APINews.createStockNews(
          stock.code,
          stock.name,
          news.id,
        );
        if (status === 200) {
          alert('등록되었습니다');
          setNewsManualForm(newsManualFormInit);
          reloadElement(stock.code);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleExtract = useCallback(
    async (sentence) => {
      try {
        const tokens = tokenize(sentence);
        if (!tokens) return;

        const tags = await extractKeywords(tokens);
        tags.forEach((tag) => {
          createOrUpdateTag(stock, tag);
        });
        reloadElement(stock.code);
      } catch (error) {
        console.error(error);
      }
    },
    [reloadElement, stock, createOrUpdateTag],
  );
  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewsManualForm((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const deleteStockTag = async (stock, tag) => {
    const { status } = await APIStock.deleteTag(
      stock.code,
      tag.tag_id,
    );
    if (status === 200) {
      alert('성공적으로 삭제되었습니다.');
      reloadElement(stock.code);
    }
  };

  const paginatedComments = applyPagination(
    stock.comments,
    commentPage,
    3,
  );

  const paginatedNews = applyPagination(stock.news, newsPage, 3);

  return (
    <Dialog
      open={isOpen}
      onClose={setClose}
      data-testid="stock-form-modal"
      maxWidth="lg"
    >
      <Paper>
        <Card>
          <CardHeader
            subheader={
              <Typography color="textPrimary" variant="h4">
                {`${stock.name} (${stock.code})`}
              </Typography>
            }
            sx={{ pb: 0 }}
            title={
              <Typography color="textSecondary" variant="overline">
                stock name(code)
              </Typography>
            }
          />

          <CardContent>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                paddingTop: 2,
                marginBottom: 4,
              }}
            >
              <Divider sx={{ mb: 2 }} />
              {stock.tags &&
                stock.tags.map((tag, i) => {
                  return (
                    <Chip
                      onDelete={() => deleteStockTag(stock, tag)}
                      key={i}
                      onClick={() => createOrUpdateTag(stock, tag)}
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

              <div style={{ width: '100%' }} />
              <Typography color="textSecondary" fontSize={13}>
                키워드 클릭 시 최신으로 업데이트 됩니다.
              </Typography>
            </Box>

            <Grid item md={12} xs={12}>
              {tagLoading && (
                <div data-testid="tag-loading">
                  <LinearProgress />
                </div>
              )}
              <Autocomplete
                multiple
                fullWidth
                autoHighlight
                options={tagList}
                onChange={(event, keywords: Tag[], reason, item) => {
                  if (reason === 'selectOption') {
                    createOrUpdateTag(stock, item.option);
                  }
                }}
                getOptionLabel={(option) => {
                  const label = option.name;
                  if (option.isNew) {
                    return `+ '${label}'`;
                  }
                  return label;
                }}
                filterOptions={(options, params) => {
                  const filtered = tagFilter(options, params);
                  if (
                    user.role.type !== IRoleType.Author &&
                    filtered.length === 0 &&
                    params.inputValue !== ''
                  ) {
                    filtered.push({
                      id: Math.random(),
                      isNew: true,
                      name: params.inputValue,
                    });
                  }

                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(event) =>
                      setTagInput(event.target.value)
                    }
                    fullWidth
                    label="키워드"
                    name="keyword"
                    variant="outlined"
                    helperText="신규 생성 권한은 관리자에게 문의 바랍니다."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {tagLoading && (
                            <CircularProgress
                              color="inherit"
                              size={20}
                            />
                          )}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Box>
              <Typography
                variant="overline"
                color="textSecondary"
                fontSize={18}
              >
                종목 코멘트
              </Typography>
              <Typography variant="overline" color="textSecondary">
                (최신 순)
              </Typography>

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
                          {paginatedComments.map((item) => (
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
                    count={stock.comments.length}
                    onPageChange={(event, value) =>
                      setCommentPage(value)
                    }
                    page={commentPage}
                    rowsPerPage={3}
                    rowsPerPageOptions={[3]}
                  />
                </Card>{' '}
                <Box
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    paddingTop: 3,
                  }}
                >
                  <TextField
                    multiline
                    style={{ width: '70%' }}
                    name="comment"
                    id="comment"
                    label="코멘트 (줄 바꾸기 Enter)"
                    variant="outlined"
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    onBlur={(e) => {
                      handleExtract(e.target.value);
                    }}
                  />
                  <TextField
                    id="date"
                    type="date"
                    value={commentDate.format('YYYY-MM-DD')}
                    onChange={(event) =>
                      setCommentDate(dayjs(event.target.value))
                    }
                  />

                  <Button
                    style={{ marginLeft: '10px' }}
                    color="primary"
                    size="medium"
                    variant="contained"
                    onClick={() => {
                      if (!comment) {
                        alert('입력해주세요');
                        return;
                      }
                      postStockComment(
                        comment,
                        stock.code,
                        commentDate.toISOString(),
                      );
                      handleExtract(comment);
                    }}
                  >
                    추가
                  </Button>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="overline"
                  color="textSecondary"
                  fontSize={18}
                >
                  종목 뉴스
                </Typography>
                <Typography variant="overline" color="textSecondary">
                  (최신 순)
                </Typography>
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
                      {paginatedNews.map((item) => (
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
                    count={stock.news.length}
                    onPageChange={(event, value): void =>
                      setNewsPage(value)
                    }
                    page={newsPage}
                    rowsPerPage={3}
                    rowsPerPageOptions={[3]}
                  />
                </Card>
              </Box>

              <Box
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  paddingTop: 2,
                }}
              >
                <Box width={'100%'}>
                  <FormControlLabel
                    style={{ marginBottom: '10px' }}
                    label={newsFormType ? '자동 등록' : '수기 등록'}
                    control={
                      <Switch
                        checked={newsFormType}
                        onChange={(event) =>
                          setNewsFormType(event.target.checked)
                        }
                        name="수동 등록"
                        color="primary"
                      />
                    }
                  />
                </Box>

                {newsFormType ? (
                  <>
                    <TextField
                      name="news"
                      id="news"
                      style={{ width: '70%' }}
                      label="*자동 등록은 네이버 뉴스를 지원합니다."
                      variant="outlined"
                      value={newsUrl}
                      onChange={(event) =>
                        setNewsUrl(event.target.value)
                      }
                    />
                    <TextField
                      id="date"
                      type="date"
                      label="발행일"
                      defaultValue={newsPubDate.format('YYYY-MM-DD')}
                      onChange={(event) =>
                        setNewsPubDate(dayjs(event.target.value))
                      }
                    />
                    <Button
                      color="primary"
                      size="medium"
                      variant="contained"
                      onClick={createOrSelectByUrl}
                    >
                      추가
                    </Button>
                  </>
                ) : (
                  <Box width="100%">
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        createAndSelectByHand();
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <TextField
                            fullWidth
                            label="제목"
                            name="title"
                            value={newsManualForm.title}
                            required
                            onChange={handleFormChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            fullWidth
                            label="url"
                            name="url"
                            value={newsManualForm.url}
                            required
                            onChange={handleFormChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            fullWidth
                            label="신문사"
                            name="mediaName"
                            value={newsManualForm.mediaName}
                            required
                            onChange={handleFormChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            fullWidth
                            label="발행일"
                            name="publishDate"
                            type="date"
                            value={newsManualForm.publishDate.format(
                              'YYYY-MM-DD',
                            )}
                            required
                            onChange={handleFormChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <TextField
                            fullWidth
                            label="요약"
                            required
                            name="summarized"
                            variant="outlined"
                            onChange={handleFormChange}
                            value={newsManualForm.summarized}
                          />
                        </Grid>
                      </Grid>
                      <CardActions
                        sx={{
                          justifyContent: 'flex-end',
                          p: 2,
                        }}
                      >
                        <Button
                          color="primary"
                          type="submit"
                          variant="contained"
                        >
                          추가
                        </Button>
                      </CardActions>
                    </form>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Dialog>
  );
};

export default StockForm;
