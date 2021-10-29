import React from 'react';
import * as _ from 'lodash';
import { Toaster } from 'react-hot-toast';
import { INews } from 'src/types/news';
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
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import useAuth from 'src/hooks/useAuth';

const keywordFilter = createFilterOptions<any>();
const categoryFilter = createFilterOptions<any>();

interface NewsCommentFormPresenterProps {
  isOpen: boolean;
  news: INews;

  loading: boolean;
  showConfirm: boolean;
  comment: string;
  setComment: (comment: string) => void;
  setShowConfirm: (isShow: boolean) => void;
  setOpen: (isOpen) => void;
  setShouldUpdate: (isUpdate) => void;
  handleTagChange: () => void;

  tagInput: React.RefObject<HTMLInputElement>;
  // DATA
  stockList: Stock[];
  tagList: Tag[];
  categoryList: Category[];
  commentList: any[];
  stockLoading: boolean;
  tagLoading: boolean;
  categoryLoading: boolean;
  refetchTag: () => void;
  refetchComment: () => void;

  // API Request
  submit: () => void;
  extractStockAndKeyword: (sentence: string) => void;
  addStock: (stockcode, stockname) => void;
  deleteStock: (stockcode) => void;
  addKeyword: (tag: Tag) => void;
  deleteKeyword: (tag: Tag) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (category: Category) => void;
}

const NewsCommentFormPresenter: React.FC<NewsCommentFormPresenterProps> =
  (props) => {
    const {
      isOpen,
      news,
      tagInput,
      loading,
      showConfirm,
      setShowConfirm,
      setOpen,
      handleTagChange,
      extractStockAndKeyword,
      submit,
      addStock,
      deleteStock,
      addKeyword,
      deleteKeyword,
      addCategory,
      deleteCategory,
      stockList,
      stockLoading,
      tagList,
      tagLoading,
      categoryList,
      categoryLoading,
      commentList,
      comment,
      setComment,
    } = props;

    const { user } = useAuth();
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
                    deleteStock(item.option.stockcode);

                  if (reason === 'selectOption')
                    addStock(
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
                    deleteKeyword(item.option);

                  if (reason === 'selectOption')
                    addKeyword(item.option);
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
                    deleteCategory(item.option);

                  if (reason === 'selectOption')
                    addCategory(item.option);
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
              handleOnClick={() => submit()}
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
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              helperText="줄 바꾸기 enter"
              onBlur={(e) => {
                extractStockAndKeyword(e.target.value);
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

export default NewsCommentFormPresenter;
