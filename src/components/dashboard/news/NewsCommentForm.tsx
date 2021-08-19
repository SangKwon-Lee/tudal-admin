import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
} from 'react';
import * as _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import { INews, INewsComment } from 'src/types/news';
import { Category, Stock, Tag } from 'src/types/schedule';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';

import NewsCommentHistory from './NewsCommentHistory';
import {
  Box,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';

import { IRoleType } from 'src/types/user';
import useAsync from 'src/hooks/useAsync';
import { APICategory, APINews, APIStock, APITag } from 'src/lib/api';
import {
  tokenize,
  extractStocks,
  extractKeywords,
} from 'src/utils/extractKeywords';
import { getByTestId } from '@testing-library/react';
import { FixtureNews, FixtureStocks } from 'src/fixtures';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import useAuth from 'src/hooks/useAuth';
import { createComment } from 'src/lib/api/news.api';

const keywordFilter = createFilterOptions<any>();
const categoryFilter = createFilterOptions<any>();

interface NewsCommentFormProps {
  isOpen: boolean;
  setOpen: (isOpen) => void;
  news: INews;
  reload: () => void;
}

enum NewsCommentActionType {
  CLEAR = 'CLEAR',
  ADD_STOCK = 'ADD_STOCK',
  ADD_KEYWORD = 'ADD_KEYWORD',
  REPLACE_STOCK = 'REPLACE_STOCK',
  REPLACE_KEYWORD = 'REPLACE_KEYWORD',
  ADD_CATEGORY = 'ADD_CATEGORY',
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

    case NewsCommentActionType.ADD_CATEGORY:
      if (_.find(state.categories, ['id', payload.id])) {
        return state;
      }
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case NewsCommentActionType.REPLACE_CATEGORY:
      return { ...state, categories: payload };

    case NewsCommentActionType.SHOW_CONFIRM: {
      return { ...state, showConfirm: true };
    }

    case NewsCommentActionType.CLOSE_CONFIRM: {
      return { ...state, showConfirm: false, submitForm: false };
    }

    case NewsCommentActionType.SUBMIT: {
      return { ...state, submitForm: true };
    }
  }
};

const NewsCommentForm: React.FC<NewsCommentFormProps> = (props) => {
  const { user } = useAuth();
  const { isOpen, setOpen, news, reload } = props;

  const tagInput = useRef(null);

  const [commentForm, dispatch] = useReducer(
    scheduleFormReducer,
    initialNewsCommentForm,
  );

  const [{ data: stockList, loading: stockLoading }] = useAsync<
    Stock[]
  >(APIStock.getList, [], []);

  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
  }, [tagInput]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput.current], []);

  const [{ data: categoryList, loading: categoryLoading }] = useAsync<
    Tag[]
  >(APICategory.getList, [], []);

  const [{ data: commentList }, refetchComment] = useAsync<
    INewsComment[]
  >(() => APINews.getComments(news.id), [], []);

  const handleTagChange = _.debounce(refetchTag, 300);

  const handleExtract = useCallback(
    async (sentence) => {
      try {
        const tokens = tokenize(sentence);
        if (!tokens) return;
        const { extractedStocks: stocks, tokenized: afterStock } =
          extractStocks(stockList, tokens);

        const tags = await extractKeywords(afterStock);
        stocks.forEach((stock) => {
          dispatch({
            type: NewsCommentActionType.ADD_STOCK,
            payload: stock,
          });
          handleAddStock(stock.stockcode, stock.stockname);
        });

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

  const handleSubmit = useCallback(async () => {
    if (!commentForm.submitForm) {
      return;
    }
    const data: any = {
      comment: commentForm.comment,
      author: user.id,
      general_news: news.id,
    };

    try {
      const { status } = await APINews.createComment(data);
      if (status === 200) {
        refetchComment();

        dispatch({ type: NewsCommentActionType.CLOSE_CONFIRM });
        dispatch({ type: NewsCommentActionType.CLEAR });
      }
    } catch (error) {
      console.error(error);
    }
  }, [commentForm, user, news, refetchComment]);

  useEffect(() => {
    commentForm.submitForm && handleSubmit();
  }, [commentForm.submitForm, handleSubmit]);

  useEffect(() => {
    props.news.stocks.forEach((stock) => {
      dispatch({
        type: NewsCommentActionType.ADD_STOCK,
        payload: {
          //@ts-ignore
          stockname: stock.keyword,
          stockcode: stock.stockcode,
        },
      });
    });
    props.news.tags.forEach((tag) => {
      dispatch({
        type: NewsCommentActionType.ADD_KEYWORD,
        payload: tag,
      });
    });
    props.news.categories.forEach((category) => {
      dispatch({
        type: NewsCommentActionType.ADD_CATEGORY,
        payload: category,
      });
    });
  }, []);

  const handleDeleteStock = async (stockcode) => {
    try {
      const { data } = await APINews.deleteByStockAndNews(
        stockcode,
        news.id,
      );

      if (data[0].newsId === news.id) {
        reload();
        toast.success('삭제되었습니다.');
      } else {
        toast.error('에러가 발생했습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddStock = async (stockcode, stockname) => {
    try {
      const { data, status } = await APINews.createStockNews(
        stockcode,
        stockname,
        news.id,
      );
      if (status === 200) {
        toast.success('추가 되었습니다.');
        reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddKeyword = async (tag) => {
    try {
      console.log(tag);
      if (tag.isNew) {
        const { data, status } = await APITag.postItem(tag.name);
        if (status !== 200) {
          toast.error(
            `${tag.name} 등록에 실패하였습니다. 지속 발생 시 관리자에게 문의 바랍니다.`,
          );
          return;
        }
        tag = data;
      }

      console.log(tag);
      const updateTags = news.tags.map((tag) => tag.id);
      updateTags.push(tag.id);

      console.log(updateTags);
      const { data, status } = await APINews.update(news.id, {
        tags: updateTags,
      });
      if (status === 200) {
        toast.success('추가되었습니다.');
        reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteKeyword = async (tagId) => {
    try {
      const updateTags = news.tags
        .filter((tag) => tag.id !== tagId)
        .map((tag) => tag.id);
      const { data, status } = await APINews.update(news.id, {
        tags: updateTags,
      });
      if (status === 200) {
        toast.success('삭제되었습니다.');
        reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCategory = async (category: Category) => {
    try {
      if (category.isNew) {
        const { data, status } = await APICategory.postItem(
          category.name,
        );
        if (status !== 200) {
          toast.error(category.name + '등록에 실패하였습니다.');
          return;
        }
        category = data;
      }

      const newCategories = news.categories.map(
        (category) => category.id,
      );
      newCategories.push(category.id);
      const { status } = await APINews.update(news.id, {
        categories: newCategories,
      });
      if (status === 200) {
        toast.success('추가되었습니다.');
        reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const newCategories = news.categories
        .filter((category) => category.id !== categoryId)
        .map((category) => category.id);

      const { status } = await APINews.update(news.id, {
        categories: newCategories,
      });
      if (status === 200) {
        toast.success('삭제되었습니다.');
        reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);
  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      data-testid="news-add-modal-form"
    >
      <div>
        <Toaster />
      </div>
      <DialogTitle data-testid="news-comment-add-dialog">
        {news.title}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={stockList}
              data-testid="autocomplete"
              value={commentForm.stocks}
              getOptionLabel={(option) => {
                return `${option.stockname}(${option.stockcode})`;
              }}
              // getOptionSelected={(option, value) =>
              //   option.stockcode === value.stockcode
              // }
              onChange={(event, stocks: Stock[], reason, item) => {
                if (reason === 'removeOption')
                  handleDeleteStock(item.option.stockcode);

                if (reason === 'selectOption')
                  handleAddStock(
                    item.option.stockcode,
                    item.option.stockname,
                  );
                if (reason === 'clear')
                  commentForm.stocks.forEach((stock) =>
                    handleDeleteStock(stock.stockcode),
                  );

                dispatch({
                  type: NewsCommentActionType.REPLACE_STOCK,
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
            {stockLoading && (
              <div data-testid="stock-loading">
                <LinearProgress />
              </div>
            )}
          </Grid>
          <Grid item md={12} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={tagList}
              value={commentForm.keywords}
              // getOptionSelected={(option, value) =>
              //   option.id === value.id
              // }
              onChange={(event, keywords: Tag[], reason, item) => {
                if (reason === 'removeOption')
                  handleDeleteKeyword(item.option.id);

                if (reason === 'selectOption')
                  handleAddKeyword(item.option);

                if (reason === 'clear')
                  commentForm.keywords.forEach((tag) =>
                    handleDeleteKeyword(tag.id),
                  );
                dispatch({
                  type: NewsCommentActionType.REPLACE_KEYWORD,
                  payload: keywords,
                });
              }}
              getOptionLabel={(option) => {
                const label = option.name;
                if (option.isNew) {
                  return `+ '${label}'`;
                }
                return label;
              }}
              filterOptions={(options, params) => {
                const filtered = keywordFilter(options, params);
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
                  helperText="신규 생성 권한은 관리자에게 문의 바랍니다."
                  inputRef={tagInput}
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
            {tagLoading && (
              <div data-testid="tag-loading">
                <LinearProgress />
              </div>
            )}
          </Grid>
          <Grid item md={12} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              data-testid="autocomplete-category"
              options={categoryList}
              value={commentForm.categories}
              // getOptionSelected={(option: Category, value) =>
              //   option.id === value.id
              // }
              getOptionLabel={(option: Category) => {
                const label = option.name;

                if (option.isNew) {
                  return `+ '${label}'`;
                }
                return label;
              }}
              onChange={(
                event,
                categories: Category[],
                reason,
                item,
              ) => {
                if (reason === 'removeOption')
                  handleDeleteCategory(item.option.id);

                if (reason === 'selectOption')
                  handleAddCategory(item.option);

                if (reason === 'clear')
                  commentForm.categories.forEach((category) =>
                    handleDeleteCategory(category.id),
                  );

                dispatch({
                  type: NewsCommentActionType.REPLACE_CATEGORY,
                  payload: categories,
                });
              }}
              filterOptions={(options, params) => {
                const filtered = categoryFilter(options, params);
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
                  fullWidth
                  label="카테고리"
                  name="category"
                  variant="outlined"
                  helperText="신규 생성 권한은 관리자에게 문의 바랍니다."
                  onClick={() => console.log('hello')}
                />
              )}
            />
            {categoryLoading && (
              <div data-testid="category-loading">
                <LinearProgress />
              </div>
            )}
          </Grid>
        </Grid>
        <Dialog
          aria-labelledby="ConfirmModal"
          open={commentForm.showConfirm}
          onClose={() =>
            dispatch({ type: NewsCommentActionType.CLOSE_CONFIRM })
          }
        >
          <ConfirmModal
            title={'뉴스 코멘트 추가'}
            content={'뉴스 코멘트를 추가하시겠습니까?'}
            confirmTitle={'추가'}
            type={'CONFIRM'}
            handleOnClick={() =>
              dispatch({ type: NewsCommentActionType.SUBMIT })
            }
            handleOnCancel={() =>
              dispatch({ type: NewsCommentActionType.CLOSE_CONFIRM })
            }
          />
        </Dialog>
        <Box m={5} />
        <Grid item md={12} xs={12}>
          <TextField
            fullWidth
            multiline
            name="comment"
            id="comment"
            label="코멘트"
            value={commentForm.comment}
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
            }}
          />
        </Grid>

        <Box m={2} display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            type="submit"
            variant="contained"
            onClick={() =>
              dispatch({ type: NewsCommentActionType.SHOW_CONFIRM })
            }
          >
            코멘트 등록
          </Button>
        </Box>
        <Grid item md={12} xs={12}>
          {!_.isEmpty(commentList) && (
            <NewsCommentHistory newsComments={commentList} />
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default NewsCommentForm;
