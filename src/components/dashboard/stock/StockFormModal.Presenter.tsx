import React, { useRef } from 'react';
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

import * as _ from 'lodash';
import { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';

import { Tag } from 'src/types/schedule';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import { IRoleType } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import {
  StockFormAction,
  StockFormState,
  StockFormActionKind,
} from './StockFormModal.Container';
import { INews } from 'src/types/news';

const tagFilter = createFilterOptions<any>();

interface StockFormProps {
  dispatch: (params: StockFormAction) => void;
  stockFormState: StockFormState;
  isOpen: boolean;
  setClose: () => void;
  stock: IStockDetailsWithTagCommentNews;
  tagLoading: boolean;
  tagList: Tag[];
  handleTagChange: _.DebouncedFunc<() => void>;
  createOrUpdateTag: (stock: any, tag: any) => Promise<void>;
  createOrUpdateTagList: (stock: any, tags: Tag[]) => Promise<void>;
  createOrSelectByUrl: () => Promise<void>;
  createAndSelectByHand: () => Promise<void>;
  handleExtract: (sentence: any) => Promise<void>;
  deleteStockTag: (stock: any, tag: any) => Promise<void>;
  postStockComment: (
    message: any,
    stock: any,
    dateTime: any,
  ) => Promise<void>;
  updateComment: () => Promise<void>;
  deleteComment: () => Promise<void>;
  paginatedComments: IStockComment[];
  paginatedNews: INews[];
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

const StockFormPresenter: React.FC<StockFormProps> = (props) => {
  const { user } = useAuth();
  const {
    dispatch,
    stockFormState,
    isOpen,
    setClose,
    stock,
    tagList,
    tagLoading,
    handleTagChange,
    createOrUpdateTag,
    createOrSelectByUrl,
    createAndSelectByHand,
    deleteStockTag,
    postStockComment,
    updateComment,
    deleteComment,
    paginatedComments,
    paginatedNews,
  } = props;
  const {
    commentPage,
    openConfirm,
    loading,
    newsPage,
    newsFormType,
    newsPubDate,
    newsUrl,
    newsManualForm,
    commentDate,
    comment,
    isUpdating,
  } = stockFormState;
  const tagInput = useRef(null);
  const classes = useStyles();

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
        onClose={() =>
          dispatch({
            type: StockFormActionKind.CHANGE_OPEN_CONFIRM,
            payload: false,
          })
        }
      >
        <ConfirmModal
          title={'코멘트 제거'}
          content={'코멘트를 제거하시겠습니까?'}
          confirmTitle={'제거'}
          type={'ERROR'}
          handleOnClick={deleteComment}
          handleOnCancel={() =>
            dispatch({
              type: StockFormActionKind.CHANGE_OPEN_CONFIRM,
              payload: false,
            })
          }
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
                                    dispatch({
                                      type: StockFormActionKind.CHANGE_IS_UPDATING,
                                      payload: true,
                                    });
                                    dispatch({
                                      type: StockFormActionKind.CHANGE_TARGET_COMMENT,
                                      payload: item.id,
                                    });
                                    dispatch({
                                      type: StockFormActionKind.CHANGE_COMMENT,
                                      payload: item.message,
                                    });
                                    dispatch({
                                      type: StockFormActionKind.CHANGE_COMMENT_DATE,
                                      payload: dayjs(item.datetime),
                                    });
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <DeleteIcon
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    dispatch({
                                      type: StockFormActionKind.CHANGE_TARGET_COMMENT,
                                      payload: item.id,
                                    });
                                    dispatch({
                                      type: StockFormActionKind.CHANGE_OPEN_CONFIRM,
                                      payload: true,
                                    });
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
                      dispatch({
                        type: StockFormActionKind.CHANGE_COMMENT_PAGE,
                        payload: value,
                      })
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
                      dispatch({
                        type: StockFormActionKind.CHANGE_COMMENT,
                        payload: event.target.value,
                      })
                    }
                  />
                  <TextField
                    id="date"
                    type="date"
                    value={commentDate.format('YYYY-MM-DD')}
                    onChange={(event) =>
                      dispatch({
                        type: StockFormActionKind.CHANGE_COMMENT_DATE,
                        payload: dayjs(event.target.value),
                      })
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
                      dispatch({
                        type: StockFormActionKind.CHANGE_NEWS_PAGE,
                        payload: value,
                      })
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
                          dispatch({
                            type: StockFormActionKind.CHANGE_NEWS_FORM_TYPE,
                            payload: event.target.checked,
                          })
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
                        dispatch({
                          type: StockFormActionKind.CHANGE_NEWS_URL,
                          payload: event.target.value,
                        })
                      }
                    />
                    <TextField
                      id="date"
                      type="date"
                      label="발행일"
                      defaultValue={newsPubDate.format('YYYY-MM-DD')}
                      onChange={(event) =>
                        dispatch({
                          type: StockFormActionKind.CHANGE_NEWS_PUB_DATE,
                          payload: dayjs(event.target.value),
                        })
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
                            onChange={(event) => {
                              dispatch({
                                type: StockFormActionKind.CHANGE_NEWS_MANUALFORM_INPUT,
                                payload: event,
                              });
                            }}
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
                            onChange={(event) => {
                              dispatch({
                                type: StockFormActionKind.CHANGE_NEWS_MANUALFORM_INPUT,
                                payload: event,
                              });
                            }}
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
                            onChange={(event) => {
                              dispatch({
                                type: StockFormActionKind.CHANGE_NEWS_MANUALFORM_INPUT,
                                payload: event,
                              });
                            }}
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
                            onChange={(event) => {
                              dispatch({
                                type: StockFormActionKind.CHANGE_NEWS_MANUALFORM_INPUT,
                                payload: event,
                              });
                            }}
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
                            onChange={(event) => {
                              dispatch({
                                type: StockFormActionKind.CHANGE_NEWS_MANUALFORM_INPUT,
                                payload: event,
                              });
                            }}
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

export default StockFormPresenter;
