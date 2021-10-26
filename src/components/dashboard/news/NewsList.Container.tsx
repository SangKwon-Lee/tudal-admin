import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import toast from 'react-hot-toast';
import { INews } from 'src/types/news';
import * as _ from 'lodash';
import NewsListPresenter from './NewsList.Presenter';
import { APINews } from 'src/lib/api';
import { updateIsSelected } from 'src/lib/api/news.api';
import useAuth from 'src/hooks/useAuth';

export enum NewsListActionKind {
  LOADING = 'LOADING',
  CHANGE_NEWS = 'CHANGE_NEWS',
  LOAD_NEWS = 'LOAD_NEWS',
  SELECT_TARGET = 'SELECT_TARGET',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',

  // QUERY/
  CHANGE_QUERY = 'CHANG_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_REFRESH_MINUTES = 'CHANGE_REFRESH_MINUTES',
}

type Sort =
  | 'publishDate:desc'
  | 'publishDate:asc'
  | 'isSelected:desc';

interface SortOption {
  value: Sort;
  label: string;
}
export const sortOptions: SortOption[] = [
  {
    label: '등록순 (최신)',
    value: 'publishDate:desc',
  },
  {
    label: '등록순 (오래된)',
    value: 'publishDate:asc',
  },
  {
    label: '선택순',
    value: 'isSelected:desc',
  },
];

export interface INewsListAction {
  type: NewsListActionKind;
  payload?: any;
}

export interface INewsListState {
  list: INews[];
  listLength: number;
  loading: boolean;
  targetSelect: INews;
  minutesRefresh: number;
  isOpenConfirm: boolean;
  page: number;
  query: {
    _q: string;
    _start: number;
    _limit: number;
    _sort: string;
  };
}

const initialState: INewsListState = {
  list: [],
  listLength: 0,
  targetSelect: null,
  minutesRefresh: 3,
  loading: true,
  page: 1,
  isOpenConfirm: false,
  query: {
    _q: '',
    _start: 0,
    _limit: 50,
    _sort: sortOptions[0].value,
  },
};

const newsReducer = (
  state: INewsListState,
  action: INewsListAction,
): INewsListState => {
  const { type, payload } = action;
  switch (type) {
    case NewsListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case NewsListActionKind.LOAD_NEWS:
      return {
        ...state,
        loading: false,
        list: payload.data,
        listLength: payload.count,
      };

    case NewsListActionKind.SELECT_TARGET:
      console.log(payload);
      return {
        ...state,
        list: state.list.map((news) => {
          if (news.id === payload.id) return payload;
          return news;
        }),
        targetSelect: payload,
      };

    case NewsListActionKind.CHANGE_QUERY:
      const { name, value } = payload;
      return {
        ...state,
        query: {
          ...state.query,
          [name]: value,
        },
      };
    case NewsListActionKind.CHANGE_REFRESH_MINUTES:
      return {
        ...state,
        minutesRefresh: payload,
      };

    case NewsListActionKind.CLOSE_SELECT_CONFIRM:
      return {
        ...state,
        targetSelect: null,
      };
    case NewsListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * state.query._limit,
        },
      };
  }
};
interface INewsListContainerProps {
  formTarget: INews;
  isOpenForm: boolean;
  shouldUpdate: boolean;
  setFormTarget: (news) => void;
  setIsOpenForm: (isOpen: boolean) => void;
  setShouldUpdate: (isUpdate: boolean) => void;
  pageTopRef: React.RefObject<HTMLDivElement>;
}

const NewsListContainer: React.FC<INewsListContainerProps> = (
  props,
) => {
  const { user } = useAuth();
  const {
    formTarget,
    setFormTarget,
    pageTopRef,
    shouldUpdate,
    setIsOpenForm,
    setShouldUpdate,
  } = props;
  const [newsListState, dispatch] = useReducer(
    newsReducer,
    initialState,
  );

  const [tick, setTick] = useState<boolean>(false);
  const { targetSelect } = newsListState;

  const getList = useCallback(
    async (scrollToTop = true) => {
      dispatch({ type: NewsListActionKind.LOADING });
      try {
        const { data } = await APINews.getList(newsListState.query);
        const { data: count } = await APINews.getListCount(
          newsListState.query,
        );
        dispatch({
          type: NewsListActionKind.LOAD_NEWS,
          payload: { count, data },
        });

        if (shouldUpdate) {
          setFormTarget(_.find(data, ['id', formTarget.id]));
          setShouldUpdate(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        scrollToTop &&
          pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [newsListState.query, shouldUpdate],
  );

  console.log(newsListState.minutesRefresh);
  useEffect(() => {
    function refreshTimer() {
      return setTimeout(() => {
        setTick((prev) => !prev);
      }, newsListState.minutesRefresh * 1000 * 60);
    }
    refreshTimer();
    return () => clearTimeout(refreshTimer());
  }, [tick, newsListState.minutesRefresh]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    toast.promise(getList(false), {
      loading: '뉴스 업데이트 중입니다.',
      success: '완료했습니다 :)',
      error: '처리하는 도중 에러가 발생했습니다. :(',
    });
  }, [tick, getList]);

  const updateSelect = async () => {
    await updateIsSelected(
      targetSelect.id,
      targetSelect.isSelected,
      user.id,
    );
    dispatch({ type: NewsListActionKind.CLOSE_SELECT_CONFIRM });
    getList(false);
  };

  return (
    <NewsListPresenter
      newsListState={newsListState}
      dispatch={dispatch}
      formTarget={formTarget}
      setFormTarget={setFormTarget}
      setIsOpenForm={setIsOpenForm}
      updateSelect={updateSelect}
    />
  );
};

export default NewsListContainer;
