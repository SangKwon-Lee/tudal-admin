import React, { useState, useCallback } from 'react';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import {
  Dialog,
  Paper,
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
  Input,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  tokenize,
  extractStocks,
  extractKeywords,
} from 'src/utils/extractKeywords';

import * as _ from 'lodash';
import { FixtureStocks } from 'src/fixtures';
import useAsync from 'src/hooks/useAsync';
import { Tag } from 'src/types/schedule';
import { APINews, APIStock, APITag } from 'src/lib/api';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import { IRoleType } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';
import dayjs from 'dayjs';

const tagFilter = createFilterOptions<any>();

interface StockFormProps {
  stock: IStockDetailsWithTagCommentNews;
  isOpen: boolean;
  postStockComment: (message: string, stock: string) => void;
  reloadElement: (id: string) => void;
  setClose: () => void;
}

const StockForm: React.FC<StockFormProps> = (props) => {
  const { user } = useAuth();
  const { stock, isOpen, setClose, reloadElement, postStockComment } =
    props;
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [newsUrl, setNewsUrl] = useState('');

  const [{ data: tagList, loading: tagLoading }] = useAsync<Tag[]>(
    () => APITag.getList(tagInput),
    [tagInput],
    [],
  );

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
    [reloadElement, stock],
  );

  const createOrUpdateTag = async (stock, tag) => {
    const { data, status } = await APIStock.updateStockTag(
      stock.code,
      tag.name,
    );
    reloadElement(stock.code);

    if (status === 200) {
      alert('성공하였습니다');
    }
  };

  const createOrSelectNews = async () => {
    try {
      const { data, status } = await APINews.postOrSelectCustomNews(
        newsUrl,
        stock.code,
        user.id,
      );

      if (status === 200) {
        console.log(data);
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

  return (
    <Dialog
      open={isOpen}
      onClose={setClose}
      data-testid="stock-form-modal"
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
                  if (reason === 'removeOption') {
                    // handleDeleteKeyword(item.option.id);
                  }

                  if (reason === 'selectOption') {
                    console.log(stock.code, item.option.name);
                    createOrUpdateTag(stock, item.option);
                  }

                  if (reason === 'clear') {
                    // commentForm.keywords.forEach((tag) =>
                    //   handleDeleteKeyword(tag.id),
                    // );
                    // dispatch({
                    //   type: NewsCommentActionType.REPLACE_KEYWORD,
                    //   payload: keywords,
                    // });
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

            <Box
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                display: 'flex',
                flexWrap: 'wrap',
                paddingTop: 2,
              }}
            >
              <TextField
                fullWidth
                multiline
                name="comment"
                id="comment"
                label="코멘트"
                variant="outlined"
                helperText="줄 바꾸기 enter"
                onChange={(event) => setComment(event.target.value)}
                onBlur={(e) => {
                  // handleExtract(e.target.value);
                }}
              />
              <Button
                color="primary"
                size="medium"
                variant="contained"
                onClick={() => {
                  postStockComment(comment, stock.code);
                  handleExtract(comment);
                }}
              >
                추가
              </Button>
            </Box>
            <Box>
              <Grid item md={12} xs={12}>
                <Typography
                  variant="overline"
                  color="textSecondary"
                  fontSize={15}
                >
                  종목 코멘트
                </Typography>
                <Typography variant="overline" color="textSecondary">
                  (최신 순)
                </Typography>
                {stock.comments &&
                  stock.comments.map((comment, i) => (
                    <Box
                      sx={{
                        pb: 2,
                      }}
                      key={i}
                    >
                      <Typography
                        variant="h6"
                        fontSize={12}
                        color="textPrimary"
                      >
                        <Box sx={{ p: 3 }}>
                          <pre>{comment.message} </pre>
                        </Box>
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {comment.updated_at}{' '}
                      </Typography>
                    </Box>
                  ))}
              </Grid>

              <Box
                sx={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  display: 'flex',
                  flexWrap: 'wrap',
                  paddingTop: 2,
                }}
              >
                <TextField
                  fullWidth
                  name="news"
                  id="news"
                  label="기사 직접 등록"
                  variant="outlined"
                  value={newsUrl}
                  helperText="*네이버 뉴스를 지원합니다."
                  onChange={(event) => setNewsUrl(event.target.value)}
                />
                <Button
                  color="primary"
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    createOrSelectNews();
                  }}
                >
                  추가
                </Button>
                {stock.news &&
                  stock.news.map((news, i) => {
                    return (
                      <Box
                        sx={{
                          pb: 2,
                        }}
                        key={i}
                      >
                        <Typography
                          variant="overline"
                          color="textSecondary"
                          fontSize={15}
                        >
                          관련 뉴스
                        </Typography>
                        <Typography
                          variant="overline"
                          color="textSecondary"
                        >
                          (선택 뉴스, 최신 순)
                        </Typography>

                        <Typography
                          variant="h6"
                          fontSize={15}
                          color="textPrimary"
                        >
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textDecoration: 'underline',
                              color: 'inherit',
                            }}
                          >
                            - {news.title}{' '}
                          </a>
                        </Typography>
                        <Typography variant="body1" fontSize={15}>
                          {news.summarized}{' '}
                        </Typography>
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Dialog>
  );
};

export default StockForm;
