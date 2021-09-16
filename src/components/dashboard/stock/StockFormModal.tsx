import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  IStockComment,
  IStockDetailsWithTagCommentNews,
} from 'src/types/stock';
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
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';

import { makeStyles } from '@material-ui/core/styles';

import { tokenize, extractKeywords } from 'src/utils/extractKeywords';

import * as _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';

import useAsync from 'src/hooks/useAsync';
import { Tag } from 'src/types/schedule';
import { APINews, APIStock, APITag } from 'src/lib/api';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import { IRoleType } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';
import { applyPagination } from 'src/utils/pagination';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';

const tagFilter = createFilterOptions<any>();

interface StockFormProps {
  stock: IStockDetailsWithTagCommentNews;
  isOpen: boolean;

  reloadStock: (id: string) => void;
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
  const tagInput = useRef(null);
  const { stock, isOpen, setClose, reloadStock } = props;
  const [comment, setComment] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  // page
  const [commentPage, setCommentPage] = useState(0);
  const [newsPage, setNewsPage] = useState(0);

  // news
  const [newsFormType, setNewsFormType] = useState(true); // false: 자동등록, true: 수동등록
  const [commentDate, setCommentDate] = useState(dayjs());
  const [newsPubDate, setNewsPubDate] = useState(dayjs());

  // target
  const [targetComment, setTargetComment] = useState<number>(null);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [newsManualForm, setNewsManualForm] = useState(
    newsManualFormInit,
  );
  const classes = useStyles();

  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
  }, [tagInput]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput.current], []);

  const handleTagChange = _.debounce(refetchTag, 300);

  const createOrUpdateTag = useCallback(
    async (stock, tag) => {
      try {
        if (tag.isNew) {
          const { status } = await APIStock.createTag(
            stock.code,
            tag.name,
          );
          if (status !== 200) {
            throw new Error('서버 에러가 발생했습니다.');
          }
        }
        const { status, data } = await APIStock.updateTag(
          stock.code,
          tag.name,
        );

        if (status === 200) {
          if (data.is_existed) {
            toast.success(`${tag.name} 이(가) 업데이트 되었습니다.`);
          } else {
            toast.success(`${tag.name} 이(가) 추가되었습니다.`);
          }
          reloadStock(stock.code);
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
    [reloadStock],
  );

  const createOrUpdateTagList = async (stock, tags: Tag[]) => {
    try {
      for (let i = 0; i < tags.length; i++) {
        const { status } = await APIStock.updateTag(
          stock.code,
          tags[i].name,
        );
        if (status === 200) {
          toast.success(`${tags[i].name} 이 추가되었습니다.`);
        }
      }
      reloadStock(stock.code);
    } catch (error) {
      console.log(error);
    }
  };

  const createOrSelectByUrl = async () => {
    try {
      setLoading(true);
      const { data, status } = await APINews.createAndSelectByURL(
        newsUrl,
        newsPubDate.toISOString(),
        stock.code,
        user.id,
      );

      if (status === 200) {
        if (data.isExisted) {
          toast.success('기존에 저장되어있던 뉴스를 가져옵니다.');
        } else {
          toast.success('등록되었습니다.');
        }
        reloadStock(stock.code);
      }
      setNewsUrl('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createAndSelectByHand = async () => {
    try {
      setLoading(true);

      const _date = dayjs(newsManualForm.publishDate);
      const _newsManualForm = {
        ...newsManualForm,
        publishDate: _date,
      };

      const { data: news } = await APINews.createAndSelectByHand(
        _newsManualForm,
        user.id,
      );

      if (news && news.id) {
        const { status } = await APINews.createStockNews(
          stock.code,
          stock.name,
          news.id,
        );
        if (status === 200) {
          toast.success('뉴스가 등록되었습니다.');
          setNewsManualForm(newsManualFormInit);
          reloadStock(stock.code);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async (sentence) => {
    try {
      setLoading(true);
      const tokens = tokenize(sentence);
      if (!tokens) return;

      const tags = await extractKeywords(tokens);
      await createOrUpdateTagList(stock, tags);

      reloadStock(stock.code);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewsManualForm((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const deleteStockTag = async (stock, tag) => {
    try {
      setLoading(true);
      const { status } = await APIStock.deleteTag(
        stock.code,
        tag.tag_id,
      );
      if (status === 200) {
        toast.success('삭제되었습니다.');
        reloadStock(stock.code);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const postStockComment = async (message, stock, dateTime) => {
    try {
      setLoading(true);

      await handleExtract(comment);

      const { status } = await APIStock.postComment(
        message,
        stock,
        user.id,
        dateTime,
      );

      if (status === 200) {
        toast.success('코멘트가 추가되었습니다.');
        setComment('');
        reloadStock(stock);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateComment = useCallback(async () => {
    const { status } = await APIStock.updateComment(targetComment, {
      message: comment,
      datetime: commentDate,
    });
    if (status === 200) {
      toast.success('코멘트가 업데이트 되었습니다.');
      setOpenConfirm(false);
      setIsUpdating(false);
      reloadStock(stock.code);
      setTargetComment(null);
      setComment('');
      setCommentDate(dayjs());
    }
  }, [targetComment, comment, commentDate, reloadStock, stock.code]);

  const deleteComment = useCallback(async () => {
    const { status } = await APIStock.deleteComment(targetComment);
    if (status === 200) {
      toast.success('코멘트가 제거되었습니다.');
      setOpenConfirm(false);
      reloadStock(stock.code);
    }
  }, [targetComment, reloadStock, stock.code]);

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
      fullWidth
      maxWidth="lg"
    >
      <Toaster />
      <Dialog
        aria-labelledby="ConfirmModal"
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
        <ConfirmModal
          title={'코멘트 제거'}
          content={'코멘트를 제거하시겠습니까?'}
          confirmTitle={'제거'}
          type={'ERROR'}
          handleOnClick={deleteComment}
          handleOnCancel={() => setOpenConfirm(false)}
        />
      </Dialog>
      <Paper>
        <Card>
          {loading && (
            <div data-testid="stock-form-modal-loading">
              <LinearProgress />
            </div>
          )}

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
                alignItems: 'stretch',
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
                      key={i}
                      label={tag.name}
                      onDelete={() => deleteStockTag(stock, tag)}
                      onClick={() => createOrUpdateTag(stock, tag)}
                      sx={{
                        ':first-of-type': {
                          mr: 1,
                        },
                        '& + &': {
                          mr: 1,
                          mb: 1,
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
                    onChange={handleTagChange}
                    inputRef={tagInput}
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
                            <TableCell>일자</TableCell>
                            <TableCell>수정</TableCell>
                            <TableCell>삭제</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedComments.map((item, i) => (
                            <TableRow key={i}>
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
                                {item.author && item.author.username}
                              </TableCell>
                              <TableCell>
                                {dayjs(item.datetime).format(
                                  'YYYY-MM-DD',
                                )}
                              </TableCell>
                              <TableCell>
                                <BuildIcon
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setIsUpdating(true);
                                    setTargetComment(item.id);
                                    setComment(item.message);
                                    setCommentDate(
                                      dayjs(item.datetime),
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <DeleteIcon
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setTargetComment(item.id);
                                    setOpenConfirm(true);
                                  }}
                                />
                              </TableCell>
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
                    style={{ width: '60%' }}
                    name="comment"
                    id="comment"
                    label="코멘트 (줄 바꾸기 Enter)"
                    variant="outlined"
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
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
                      isUpdating
                        ? updateComment()
                        : postStockComment(
                            comment,
                            stock.code,
                            commentDate.toISOString(),
                          );
                    }}
                  >
                    {isUpdating ? '수정' : '추가'}
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
                        <TableCell>제목</TableCell>
                        <TableCell>요약</TableCell>
                        <TableCell>발행 일시</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedNews.map((item, i) => (
                        <TableRow
                          key={i}
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
                                {item.title}
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
                            {dayjs(item.publishDate).format(
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
                      style={{ width: '60%' }}
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
                            value={dayjs(
                              newsManualForm.publishDate,
                            ).format('YYYY-MM-DD')}
                            required
                            onChange={handleFormChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <TextField
                            multiline
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
