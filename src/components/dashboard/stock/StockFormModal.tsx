import React, { useState } from 'react';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardHeader,
  Paper,
  Button,
  Grid,
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  LinearProgress,
  Chip,
  Typography,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItem,
  Badge,
  List,
} from '@material-ui/core';
import { formatDistanceToNowStrict } from 'date-fns';

import * as _ from 'lodash';
import { FixtureStocks } from 'src/fixtures';
import useAsync from 'src/hooks/useAsync';
import { Tag } from 'src/types/schedule';
import { APITag } from 'src/lib/api';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import { IRoleType } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';
import dayjs from 'dayjs';

const tagFilter = createFilterOptions<any>();

interface StockFormProps {
  stock: IStockDetailsWithTagCommentNews;
  isOpen: boolean;
  setClose: () => void;
}

const StockForm: React.FC = (props) => {
  // const StockForm: React.FC = (props) => {
  // const { stock, isOpen, setClose } = props;
  const { user } = useAuth();
  const [tagInput, setTagInput] = useState('');

  const stock = FixtureStocks.summaries[0];

  const [{ data: tagList, loading: tagLoading }] = useAsync<Tag[]>(
    () => APITag.getList(tagInput),
    [tagInput],
    [],
  );

  return (
    <Dialog
      open={true}
      onClose={() => console.log('herllo')}
      data-testid="stock-form-modal"
    >
      <DialogTitle data-testid="news-comment-add-dialog">
        {stock.name}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <Grid item md={12} xs={12}>
            {stock.tags &&
              stock.tags.map((tag) => {
                return (
                  <Chip
                    onClick={() => console.log('click')}
                    onDelete={() => console.log('delete')}
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
          </Grid>
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
                  // handleAddKeyword(item.option);
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
          <Grid item md={9} xs={9}>
            <TextField
              fullWidth
              multiline
              name="comment"
              id="comment"
              label="코멘트"
              variant="outlined"
              helperText="줄 바꾸기 enter"
              onChange={(event) => console.log(event)}
              onBlur={(e) => {
                // handleExtract(e.target.value);
              }}
            />
          </Grid>
          <Box m={4}>
            <Button color="primary" size="medium" variant="contained">
              추가
            </Button>
          </Box>
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
              stock.comments.map((comment, index) => (
                <Box
                  sx={{
                    pb: 2,
                  }}
                  key={comment.id}
                >
                  <Typography
                    variant="h6"
                    fontSize={12}
                    color="textPrimary"
                  >
                    <pre>{comment.message} </pre>
                  </Typography>
                  <Typography variant="body1" fontSize={15}>
                    {comment.updated_at}{' '}
                  </Typography>
                </Box>
              ))}
          </Grid>

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

          {stock.news &&
            stock.news.map((news) => {
              return (
                <Box
                  sx={{
                    pb: 2,
                  }}
                  key={news.id}
                >
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
      </DialogContent>
    </Dialog>
  );
};

export default StockForm;
