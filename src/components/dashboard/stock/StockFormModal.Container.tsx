import React, { useCallback, useRef, useReducer } from 'react';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import { tokenize, extractKeywords } from 'src/utils/extractKeywords';
import * as _ from 'lodash';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import useAsync from 'src/hooks/useAsync';
import { Tag } from 'src/types/schedule';
import { APINews, APIStock, APITag } from 'src/lib/api';
import useAuth from 'src/hooks/useAuth';
import { applyPagination } from 'src/utils/pagination';
import StockFormPresenter from './StockFormModal.Presenter';

interface StockFormProps {
  stock: IStockDetailsWithTagCommentNews;
  isOpen: boolean;
  reloadStock: (id: string) => void;
  setClose: () => void;
}

export enum StockFormActionKind {
  LOADING = 'LOADING',
  CHANGE_COMMENT = 'CHANGE_COMMENT',
  CHANGE_TARGET_COMMENT = 'CHANGE_TARGET_COMMENT',
  CHANGE_IS_UPDATING = 'CHANGE_IS_UPDATING',
  CHANGE_COMMENT_DATE = 'CHANGE_COMMENT_DATE',
  CHANGE_NEWS_FORM_TYPE = 'CHANGE_NEWS_FORM_TYPE',
  CHANGE_COMMENT_PAGE = 'CHANGE_COMMENT_PAGE',
  CHANGE_NEWS_PAGE = 'CHANGE_NEWS_PAGE',
  CHANGE_OPEN_CONFIRM = 'CHANGE_OPEN_CONFIRM',
  CHANGE_NEWS_URL = 'CHANGE_NEWS_URL',
  CHANGE_NEWS_PUB_DATE = 'CHANGE_NEWS_PUB_DATE',
  CHANGE_NEWS_MANUALFORM = 'CHANGE_NEWS_MANUALFORM',
  CHANGE_NEWS_MANUALFORM_INPUT = 'CHANGE_NEWS_MANUALFORM_INPUT',
}
export interface StockFormAction {
  type: StockFormActionKind;
  payload?: any;
}

export interface StockFormState {
  loading: boolean;
  comment: string;
  newsUrl: string;
  isUpdating: boolean;
  commentPage: number;
  newsPage: number;
  newsFormType: boolean;
  commentDate: any;
  newsPubDate: any;
  targetComment: null;
  openConfirm: boolean;
  newsManualForm: {
    title: string;
    url: string;
    mediaName: string;
    publishDate: any;
    summarized: string;
  };
}

const initialState: StockFormState = {
  loading: false,
  comment: '',
  newsUrl: '',
  isUpdating: false,
  commentPage: 0,
  newsPage: 0,
  newsFormType: true,
  commentDate: dayjs(),
  newsPubDate: dayjs(),
  targetComment: null,
  openConfirm: false,
  newsManualForm: {
    title: '',
    url: '',
    mediaName: '',
    publishDate: dayjs(),
    summarized: '',
  },
};

const StockFormReducer = (
  state: StockFormState,
  action: StockFormAction,
): StockFormState => {
  const { type, payload } = action;
  switch (type) {
    case StockFormActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case StockFormActionKind.CHANGE_COMMENT:
      return {
        ...state,
        comment: payload,
      };
    case StockFormActionKind.CHANGE_TARGET_COMMENT:
      return {
        ...state,
        targetComment: payload,
      };
    case StockFormActionKind.CHANGE_IS_UPDATING:
      return {
        ...state,
        isUpdating: payload,
      };
    case StockFormActionKind.CHANGE_COMMENT_DATE:
      return {
        ...state,
        commentDate: payload,
      };
    case StockFormActionKind.CHANGE_NEWS_URL:
      return {
        ...state,
        newsUrl: payload,
      };
    case StockFormActionKind.CHANGE_NEWS_FORM_TYPE:
      return {
        ...state,
        newsFormType: payload,
      };
    case StockFormActionKind.CHANGE_COMMENT_PAGE:
      return {
        ...state,
        commentPage: payload,
      };
    case StockFormActionKind.CHANGE_NEWS_PAGE:
      return {
        ...state,
        newsPage: payload,
      };
    case StockFormActionKind.CHANGE_NEWS_PUB_DATE:
      return {
        ...state,
        newsPubDate: payload,
      };
    case StockFormActionKind.CHANGE_OPEN_CONFIRM:
      return {
        ...state,
        openConfirm: payload,
      };
    case StockFormActionKind.CHANGE_NEWS_MANUALFORM:
      return {
        ...state,
        newsManualForm: {
          ...state.newsManualForm,
          mediaName: payload.mediaName,
          publishDate: payload.publishDate,
          summarized: payload.summarized,
          title: payload.title,
          url: payload.title,
        },
      };
    case StockFormActionKind.CHANGE_NEWS_MANUALFORM_INPUT:
      return {
        ...state,
        newsManualForm: {
          ...state.newsManualForm,
          [payload.target.name]: payload.target.value,
        },
      };
  }
};

const StockFormContainer: React.FC<StockFormProps> = (props) => {
  const [stockFormState, dispatch] = useReducer(
    StockFormReducer,
    initialState,
  );

  const { user } = useAuth();
  const tagInput = useRef(null);
  const { stock, isOpen, setClose, reloadStock } = props;

  //* 태그 관련
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
      dispatch({ type: StockFormActionKind.LOADING, payload: true });
      const { data, status } = await APINews.createAndSelectByURL(
        stockFormState.newsUrl,
        stockFormState.newsPubDate.toISOString(),
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
      dispatch({
        type: StockFormActionKind.CHANGE_NEWS_URL,
        payload: '',
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch({ type: StockFormActionKind.LOADING, payload: false });
    }
  };

  const createAndSelectByHand = async () => {
    try {
      dispatch({ type: StockFormActionKind.LOADING, payload: true });
      const _date = dayjs(stockFormState.newsManualForm.publishDate);
      const _newsManualForm = {
        ...stockFormState.newsManualForm,
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
          dispatch({
            type: StockFormActionKind.CHANGE_NEWS_MANUALFORM,
            payload: stockFormState.newsManualForm,
          });
          reloadStock(stock.code);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch({ type: StockFormActionKind.LOADING, payload: false });
    }
  };

  const handleExtract = async (sentence) => {
    dispatch({ type: StockFormActionKind.LOADING, payload: true });
    try {
      const tokens = tokenize(sentence);
      if (!tokens) return;
      const tags = await extractKeywords(tokens);
      await createOrUpdateTagList(stock, tags);
      reloadStock(stock.code);
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch({ type: StockFormActionKind.LOADING, payload: false });
    }
  };

  const deleteStockTag = async (stock, tag) => {
    dispatch({ type: StockFormActionKind.LOADING, payload: true });
    try {
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
      dispatch({ type: StockFormActionKind.LOADING, payload: false });
    }
  };

  const postStockComment = async (message, stock, dateTime) => {
    dispatch({ type: StockFormActionKind.LOADING, payload: true });
    try {
      await handleExtract(stockFormState.comment);
      const { status } = await APIStock.postComment(
        message,
        stock,
        user.id,
        dateTime,
      );
      if (status === 200) {
        toast.success('코멘트가 추가되었습니다.');
        dispatch({
          type: StockFormActionKind.CHANGE_COMMENT,
          payload: '',
        });
        reloadStock(stock);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch({ type: StockFormActionKind.LOADING, payload: false });
    }
  };

  const updateComment = useCallback(async () => {
    const { status } = await APIStock.updateComment(
      stockFormState.targetComment,
      {
        message: stockFormState.comment,
        datetime: stockFormState.commentDate,
      },
    );
    if (status === 200) {
      toast.success('코멘트가 업데이트 되었습니다.');
      dispatch({
        type: StockFormActionKind.CHANGE_OPEN_CONFIRM,
        payload: false,
      });
      dispatch({
        type: StockFormActionKind.CHANGE_IS_UPDATING,
        payload: false,
      });
      dispatch({
        type: StockFormActionKind.CHANGE_TARGET_COMMENT,
        payload: null,
      });
      dispatch({
        type: StockFormActionKind.CHANGE_COMMENT,
        payload: '',
      });
      dispatch({
        type: StockFormActionKind.CHANGE_COMMENT_DATE,
        payload: dayjs(),
      });
      reloadStock(stock.code);
    }
  }, [
    stockFormState.targetComment,
    stockFormState.comment,
    stockFormState.commentDate,
    reloadStock,
    stock.code,
  ]);

  const deleteComment = useCallback(async () => {
    const { status } = await APIStock.deleteComment(
      stockFormState.targetComment,
    );
    if (status === 200) {
      toast.success('코멘트가 제거되었습니다.');
      dispatch({
        type: StockFormActionKind.CHANGE_IS_UPDATING,
        payload: false,
      });
      dispatch({
        type: StockFormActionKind.CHANGE_OPEN_CONFIRM,
        payload: false,
      });
      reloadStock(stock.code);
    }
  }, [stockFormState.targetComment, reloadStock, stock.code]);

  const paginatedComments = applyPagination(
    stock.comments,
    stockFormState.commentPage,
    3,
  );

  const paginatedNews = applyPagination(
    stock.news,
    stockFormState.newsPage,
    3,
  );

  return (
    <StockFormPresenter
      dispatch={dispatch}
      stockFormState={stockFormState}
      isOpen={isOpen}
      setClose={setClose}
      stock={stock}
      tagLoading={tagLoading}
      tagList={tagList}
      handleTagChange={handleTagChange}
      createOrUpdateTag={createOrUpdateTag}
      createOrUpdateTagList={createOrUpdateTagList}
      createOrSelectByUrl={createOrSelectByUrl}
      createAndSelectByHand={createAndSelectByHand}
      handleExtract={handleExtract}
      deleteStockTag={deleteStockTag}
      postStockComment={postStockComment}
      updateComment={updateComment}
      deleteComment={deleteComment}
      paginatedComments={paginatedComments}
      paginatedNews={paginatedNews}
    />
  );
};

export default StockFormContainer;
