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
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import useAuth from 'src/hooks/useAuth';

const keywordFilter = createFilterOptions<any>();
const categoryFilter = createFilterOptions<any>();

interface NewsCommentFormProps {
  isOpen: boolean;
  news: INews;
  setOpen: (isOpen) => void;
  reload: () => void;
}

const NewsCommentForm: React.FC<NewsCommentFormProps> = (props) => {
  const { user } = useAuth();
  const { isOpen, setOpen, news, reload } = props;
  const [comment, setComment] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const tagInput = useRef(null);

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

  const handleSubmit = useCallback(async () => {
    const data: any = {
      comment: comment,
      author: user.id,
      general_news: news.id,
    };

    try {
      const { status } = await APINews.createComment(data);
      if (status === 200) {
        refetchComment();
        setShowConfirm(false);
        setComment('');
        toast.success('코멘트가 추가되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  }, [user, news, comment, refetchComment]);

  const handleDeleteStock = async (stockcode) => {
    try {
      setLoading(true);
      const { data } = await APINews.deleteByStockAndNews(
        stockcode,
        news.id,
      );
      if (data[0].newsId === news.id) {
        toast.success('삭제되었습니다.');
        reload();
      } else {
        toast.error('에러가 발생했습니다.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = useCallback(
    async (stockcode, stockname) => {
      try {
        setLoading(true);
        if (_.find(news.stocks, ['stockcode', String(stockcode)])) {
          toast.success(`종목 '${stockname}' 이미 존재합니다.`);
          return;
        }

        const { data, status } = await APINews.createStockNews(
          stockcode,
          stockname,
          news.id,
        );
        if (status === 200) {
          toast.success(`${stockname} 이(가) 추가되었습니다.`);
          reload();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [news, reload],
  );

  const handleAddKeyword = useCallback(
    async (tag: Tag) => {
      try {
        // 신규 추가하는 경우
        setLoading(true);
        if (tag.isNew) {
          const { data, status } = await APITag.postItem(tag.name);
          console.log(data);
          if (status !== 200) {
            toast.error(
              `${tag.name} 등록에 실패하였습니다. 지속 발생 시 관리자에게 문의 바랍니다.`,
            );
            return;
          } else {
            tag = data;
          }
        }
        if (_.find(news.tags, ['id', tag.id])) {
          toast.success(`키워드 '${tag.name}' 이미 존재합니다.`);
          return;
        }

        const { status } = await APINews.addTags(news.id, [tag.id]);

        if (status === 200) {
          toast.success(`${tag.name} 이(가) 추가되었습니다.`);
          reload();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [news, reload],
  );

  const handleDeleteKeyword = async (tag) => {
    try {
      setLoading(true);
      const { id } = tag;
      const updateTags = news.tags
        .filter((tag) => tag.id !== id)
        .map((tag) => tag.id);

      const { status } = await APINews.update(news.id, {
        tags: updateTags,
      });

      if (status === 200) {
        toast.success('삭제되었습니다.');
        reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (category: Category) => {
    try {
      setLoading(true);
      // 신규 카테고리 추가하는 경우
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

      if (_.find(news.categories, ['id', category.id])) {
        toast.success(`카테고리 '${category.name}' 이미 존재합니다.`);
        return;
      }

      const { data, status } = await APINews.addCategories(news.id, [
        category.id,
      ]);

      if (status === 200) {
        toast.success(`${category.name} 이(가) 추가되었습니다.`);
        reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = useCallback(
    async (sentence) => {
      setLoading(true);
      try {
        const tokens = tokenize(sentence);
        if (!tokens) return;
        const { extractedStocks: stocks, tokenized: afterStock } =
          extractStocks(stockList, tokens);

        const tags = await extractKeywords(afterStock);

        // 종목 등록
        stocks.forEach(async (stock) => {
          await handleAddStock(stock.code, stock.name);
        });

        // 키워드 등록
        if (tags) {
          const tagIds = tags.map((el) => el.id);
          const { status, data } = await APINews.addTags(
            news.id,
            tagIds,
          );
          if (status === 200) {
            toast.success('키워드 추출이 성공적으로 완료되었습니다.');
            reload();
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [handleAddStock, news.id, reload, stockList],
  );

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      data-testid="news-add-modal-form"
    >
      <div>
        <Toaster />
      </div>
      {loading && <LinearProgress style={{ height: 10 }} />}
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
              disableClearable
              options={stockList}
              data-testid="autocomplete"
              value={news.stocks}
              getOptionLabel={(option) => {
                //@ts-ignore
                return `${option.stockname || option.keyword}(${
                  option.stockcode
                })`;
              }}
              onChange={(event, stocks: Stock[], reason, item) => {
                if (reason === 'removeOption')
                  handleDeleteStock(item.option.stockcode);

                if (reason === 'selectOption')
                  handleAddStock(
                    item.option.stockcode,
                    item.option.stockname,
                  );
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
              disableClearable
              options={tagList}
              value={news.tags}
              onChange={(event, tags: Tag[], reason, item) => {
                if (reason === 'removeOption')
                  handleDeleteKeyword(item.option);

                if (reason === 'selectOption')
                  handleAddKeyword(item.option);
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
              disableClearable
              data-testid="autocomplete-category"
              options={categoryList}
              value={news.categories}
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
          open={showConfirm}
          onClose={() => setShowConfirm(true)}
        >
          <ConfirmModal
            title={'뉴스 코멘트 추가'}
            content={'뉴스 코멘트를 추가하시겠습니까?'}
            confirmTitle={'추가'}
            type={'CONFIRM'}
            handleOnClick={() => handleSubmit()}
            handleOnCancel={() => setShowConfirm(false)}
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
            value={comment}
            variant="outlined"
            helperText="줄 바꾸기 enter"
            onChange={(event) => setComment(event.target.value)}
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
            onClick={() => {
              if (comment === '') {
                alert('코멘트를 등록해주세요');
                return;
              }
              setShowConfirm(true);
            }}
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
