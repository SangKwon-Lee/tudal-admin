import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
} from 'react';
import * as _ from 'lodash';
import { INews } from 'src/types/news';
import { Category, Stock, Tag } from 'src/types/schedule';
import { findKeywords } from 'src/lib/api/tag.api';

import {
  Box,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  Typography,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';

import { IRoleType } from 'src/types/user';
import useAsync from 'src/hooks/useAsync';
import { APICategory, APIStock, APITag } from 'src/lib/api';
import {
  tokenize,
  extractStocks,
  extractKeywords,
} from 'src/utils/extractKeywords';
import { getByTestId } from '@testing-library/react';
import { FixtureStocks } from 'src/fixtures';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import useAuth from 'src/hooks/useAuth';

const customFilter = createFilterOptions<any>();
const customFilter2 = createFilterOptions<any>();

interface NewsCommentFormProps {
  isOpen: boolean;
  setOpen: (isOpen) => void;
  news: INews;
}

enum NewsCommentActionType {
  CLEAR = 'CLEAR',
  ADD_STOCK = 'ADD_STOCK',
  ADD_KEYWORD = 'ADD_KEYWORD',
  REPLACE_STOCK = 'REPLACE_STOCK',
  REPLACE_KEYWORD = 'REPLACE_KEYWORD',
  REPLACE_CATEGORY = 'REPLACE_CATEGORY',
  REPLACE_DATES = 'REPLACE_DATES',
  HANDLE_CHANGES = 'HANDLE_CHANGES',

  SHOW_CONFIRM = 'SHOW_CONFIRM',
  CLOSE_CONFIRM = 'CLOSE_CONFIRM',
  SUBMIT = 'SUBMIT',
}

interface INewsCommentFormState {
  comment: string;
  categories: Category[];
  stocks: Stock[];
  keywords: Tag[];
  showConfirm: boolean;
  submitForm: boolean;
}

const initialNewsCommentForm: INewsCommentFormState = {
  comment: '',
  categories: [],
  stocks: [],
  keywords: [],
  showConfirm: false,
  submitForm: false,
};

interface ScheduleAction {
  type: NewsCommentActionType;
  payload?: any;
}

const scheduleFormReducer = (
  state: INewsCommentFormState,
  action: ScheduleAction,
): INewsCommentFormState => {
  const { type, payload } = action;

  switch (type) {
    case NewsCommentActionType.CLEAR:
      return initialNewsCommentForm;

    case NewsCommentActionType.HANDLE_CHANGES:
      const { name, value } = payload.target;
      return { ...state, [name]: value };

    case NewsCommentActionType.ADD_STOCK:
      if (_.find(state.stocks, ['stockcode', payload.stockcode])) {
        return state;
      }
      return { ...state, stocks: [...state.stocks, action.payload] };

    case NewsCommentActionType.REPLACE_STOCK:
      return { ...state, stocks: payload };

    case NewsCommentActionType.ADD_KEYWORD:
      if (_.find(state.keywords, ['id', payload.id])) {
        return state;
      }
      return {
        ...state,
        keywords: [...state.keywords, action.payload],
      };

    case NewsCommentActionType.REPLACE_KEYWORD:
      return { ...state, keywords: payload };

    case NewsCommentActionType.REPLACE_CATEGORY:
      return { ...state, categories: payload };

    case NewsCommentActionType.SHOW_CONFIRM: {
      return { ...state, showConfirm: true };
    }

    case NewsCommentActionType.CLOSE_CONFIRM: {
      return { ...state, showConfirm: false, submitForm: false };
    }

    case NewsCommentActionType.SUBMIT: {
      return { ...state, showConfirm: false, submitForm: true };
    }
  }
};

const NewsCommentForm: React.FC<NewsCommentFormProps> = (props) => {
  const { user } = useAuth();
  const { isOpen, setOpen, news } = props;
  const tagInput = useRef(null);

  const [commentForm, dispatch] = useReducer(
    scheduleFormReducer,
    initialNewsCommentForm,
  );

  const [stockListState] = useAsync<Stock[]>(
    APIStock.getList,
    [],
    [],
  );
  const [categoryListState] = useAsync<Category[]>(
    APICategory.getList,
    [],
    [],
  );
  const getTagList = () => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
  };

  const [tagListState, refetchTag] = useAsync<Tag[]>(
    getTagList,
    [tagInput.current],
    [],
  );

  const {
    data: stockList,
    error: stockError,
    loading: stockLoading,
  } = stockListState;
  const {
    data: tagList,
    error: tagError,
    loading: tagLoading,
  } = tagListState;
  const {
    data: categoryList,
    error: categoryError,
    loading: categoryLoading,
  } = categoryListState;

  const handleTagChange = _.debounce(refetchTag, 300);

  const handleExtract = useCallback(
    async (sentence) => {
      try {
        const tokens = tokenize(sentence);
        if (!tokens) return;
        const { extractedStocks: stocks, tokenized: afterStock } =
          extractStocks(stockList, tokens);

        const tags = await extractKeywords(afterStock);
        stocks.forEach((stock) =>
          dispatch({
            type: NewsCommentActionType.ADD_STOCK,
            payload: stock,
          }),
        );

        tags.forEach((tag) =>
          dispatch({
            type: NewsCommentActionType.ADD_KEYWORD,
            payload: tag,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [stockList],
  );

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      data-testid="news-add-modal-form"
    >
      <DialogTitle data-testid="news-comment-add-dialog">
        {news.title}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              multiline
              name="comment"
              id="comment"
              label="코멘트"
              variant="outlined"
              helperText="줄 바꾸기 enter"
              onChange={(event) =>
                dispatch({
                  type: NewsCommentActionType.HANDLE_CHANGES,
                  payload: event,
                })
              }
              onBlur={(e) => {
                handleExtract(e.target.value);
                e.target.value = '';
              }}
            />
          </Grid>

          <Grid item md={12} xs={12}>
            {stockList.length === 0 && (
              <div data-testid="stock-loading-test">
                <LinearProgress />
              </div>
            )}
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={stockList}
              data-testid="autocomplete"
              value={commentForm.stocks}
              getOptionLabel={(option) =>
                `${option.stockname}(${option.stockcode})`
              }
              getOptionSelected={(option, value) =>
                option.stockcode === value.stockcode
              }
              onChange={(event, stocks: Stock[]) => {
                dispatch({
                  type: NewsCommentActionType.ADD_STOCK,
                  payload: stocks,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="종목"
                  name="stocks"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={tagList}
              value={commentForm.keywords}
              getOptionSelected={(option, value) =>
                option.id === value.id
              }
              onChange={(event, keywords: Tag[]) => {
                dispatch({
                  type: NewsCommentActionType.ADD_KEYWORD,
                  payload: keywords,
                });
              }}
              getOptionLabel={(option) => {
                const label = option.name;
                if (option.hasOwnProperty('isNew')) {
                  return `+ '${label}'`;
                }
                return label;
              }}
              filterOptions={(options, params) => {
                const filtered = customFilter(options, params);
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
                  fullWidth
                  label="키워드"
                  name="keyword"
                  variant="outlined"
                  inputRef={tagInput}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {tagLoading ? (
                          <CircularProgress
                            color="inherit"
                            size={20}
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          {/* <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value="USA"
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="State/Region"
                name="state"
                value="New York"
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Address 1"
                name="address1"
                value="Street John Wick, no. 7"
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Address 2"
                name="address2"
                value="House #25"
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone number"
                name="phone"
                value="+55 748 327 439"
                variant="outlined"
              />
            </Grid>
            <Grid item />
            <Grid item md={6} xs={12}>
              <Typography
                color="textPrimary"
                gutterBottom
                variant="subtitle2"
              >
                Email Verified
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Disabling this will automatically send the user a
                verification email
              </Typography>
              <Switch
                color="primary"
                defaultChecked
                edge="start"
                name="isVerified"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography
                color="textPrimary"
                gutterBottom
                variant="subtitle2"
              >
                Discounted Prices
              </Typography>
              <Typography color="textSecondary" variant="body2">
                This will give the user discounted prices for all
                products
              </Typography>
              <Switch
                color="primary"
                defaultChecked={false}
                edge="start"
                name="hasDiscountedPrices"
              />
            </Grid> */}
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button color="primary" type="submit" variant="contained">
            Update Customer
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewsCommentForm;
