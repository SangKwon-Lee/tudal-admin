import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { INews } from 'src/types/news';
import * as _ from 'lodash';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  Dialog,
} from '@material-ui/core';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import ChevronRightIcon from '../../icons/ChevronRight';
import useSettings from '../../hooks/useSettings';
import {
  NewsCommentForm,
  NewsListTable,
} from 'src/components/dashboard/news';
import { APINews } from 'src/lib/api';
import { updateIsSelected } from 'src/lib/api/news.api';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';

enum NewsActionKind {
  LOADING = 'LOADING',
  ADD_NEWS = 'ADD_NEWS',
  RELOAD_NEWS = 'RELOAD_NEWS',
  SET_TARGET_NEWS = 'SET_TARGET_NEWS',
  SHOW_SELECT_CONFIRM = 'SHOW_SELECT_CONFIRM',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',
  ERROR = 'ERROR',
}

interface NewsAction {
  type: NewsActionKind;
  payload?: any;
}

interface newsState {
  news: INews[];
  targetNews: INews;
  loading: boolean;
  isOpenConfirm: boolean;
  error: AxiosError<any> | boolean;
}

const initialState: newsState = {
  news: [],
  targetNews: null,
  loading: true,
  error: null,
  isOpenConfirm: false,
};

const newsReducer = (
  state: newsState,
  action: NewsAction,
): newsState => {
  const { type, payload } = action;

  switch (type) {
    case NewsActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case NewsActionKind.RELOAD_NEWS:
      return {
        ...state,
        loading: false,
        news: payload,
      };
    case NewsActionKind.ADD_NEWS:
      return {
        ...state,
        loading: false,
        news: [...state.news, ...payload],
      };
    case NewsActionKind.SET_TARGET_NEWS:
      console.log('reducer', payload);
      return {
        ...state,
        news: state.news.map((news) => {
          if (news.id === payload.id) return payload;
          return news;
        }),
        targetNews: payload,
      };
    case NewsActionKind.SHOW_SELECT_CONFIRM:
      return {
        ...state,
        isOpenConfirm: true,
      };
    case NewsActionKind.CLOSE_SELECT_CONFIRM:
      return {
        ...state,
        isOpenConfirm: false,
      };

    case NewsActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
  }
};

const News: React.FC = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [newsState, dispatch] = useReducer(newsReducer, initialState);
  const [search, setSearch] = useState<string>('');
  const [tick, setTick] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(50);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [minutesRefresh, setMinutesRefresh] = useState<number>(3);
  const [isOpen, setOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    news: newsList,
    targetNews,
    loading: newsLoading,
  } = newsState;

  const handleSearch = _.debounce(setSearch, 300);

  const handleOpenForm = useCallback(
    () => setOpen((prev) => !prev),
    [],
  );

  const handleConfirmModal = useCallback(() => {
    if (newsState.isOpenConfirm) {
      dispatch({ type: NewsActionKind.CLOSE_SELECT_CONFIRM });
    } else {
      dispatch({ type: NewsActionKind.SHOW_SELECT_CONFIRM });
    }
  }, [newsState.isOpenConfirm]);

  const getNewsList = useCallback(async () => {
    dispatch({ type: NewsActionKind.LOADING });
    try {
      const { data } = await APINews.getList(search);
      dispatch({
        type: NewsActionKind.RELOAD_NEWS,
        payload: data,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: NewsActionKind.ERROR, payload: error });
    }
  }, [search]);

  const getNews = useCallback(async () => {
    try {
      console.log('RELOAD NEWS');
      const { data, status } = await APINews.getNews(targetNews.id);

      console.log('data', data[0].tags);

      if (status === 200) {
        dispatch({
          type: NewsActionKind.SET_TARGET_NEWS,
          payload: data[0],
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: NewsActionKind.ERROR, payload: error });
    }
  }, [targetNews]);

  const addNews = useCallback(async () => {
    if (!shouldUpdate) return;
    try {
      const { data } = await APINews.getList(
        search,
        (page + 1) * limit,
      );
      dispatch({ type: NewsActionKind.ADD_NEWS, payload: data });
      setShouldUpdate(false);
    } catch (error) {}
  }, [page, limit, search, shouldUpdate]);

  useEffect(() => {
    function refreshTimer() {
      return setTimeout(() => {
        setTick((prev) => !prev);
      }, minutesRefresh * 1000 * 60);
    }
    refreshTimer();
    return () => clearTimeout(refreshTimer());
  }, [tick, minutesRefresh]);

  useEffect(() => {
    getNewsList();
  }, [getNewsList]);

  useEffect(() => {
    addNews();
  }, [addNews]);

  useEffect(() => {
    toast.promise(getNewsList(), {
      loading: '뉴스 업데이트 중입니다.',
      success: '완료했습니다 :)',
      error: '처리하는 도중 에러가 발생했습니다. :(',
    });
  }, [tick, getNewsList]);

  useEffect(() => {
    scrollRef &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  const updateSelect = async () => {
    await updateIsSelected(
      targetNews.id,
      targetNews.isSelected,
      user.id,
    );
    dispatch({ type: NewsActionKind.CLOSE_SELECT_CONFIRM });

    getNewsList();
  };

  const handlePageChange = (event: any, newPage: number): void => {
    if ((page + 1) * limit >= newsList.length - limit) {
      setShouldUpdate(true);
    }
    setPage(newPage);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        {isOpen && (
          <NewsCommentForm
            isOpen={isOpen}
            setOpen={handleOpenForm}
            news={targetNews}
            reload={getNews}
          />
        )}
        <Container
          maxWidth={settings.compact ? 'xl' : false}
          ref={scrollRef}
        >
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                뉴스 리스트
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  대시보드
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  컨텐츠관리
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  뉴스 코멘트
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <NewsListTable
              newsList={newsList}
              search={search}
              setSearch={handleSearch}
              reload={getNewsList}
              isLoading={newsLoading}
              setOpenConfirm={handleConfirmModal}
              page={page}
              setPage={handlePageChange}
              limit={limit}
              setLimit={setLimit}
              isOpenForm={isOpen}
              setOpenForm={handleOpenForm}
              setTargetNews={(target) =>
                dispatch({
                  type: NewsActionKind.SET_TARGET_NEWS,
                  payload: target,
                })
              }
              setMinutesRefresh={setMinutesRefresh}
              minutesRefresh={minutesRefresh}
            />
          </Box>
        </Container>
        <Dialog
          aria-labelledby="ConfirmModal"
          open={newsState.isOpenConfirm}
          onClose={() =>
            dispatch({ type: NewsActionKind.CLOSE_SELECT_CONFIRM })
          }
        >
          <ConfirmModal
            title={'뉴스 선택'}
            content={'뉴스를 선택하시겠습니까?'}
            confirmTitle={'추가'}
            type={'CONFIRM'}
            handleOnClick={() => updateSelect()}
            handleOnCancel={() =>
              dispatch({ type: NewsActionKind.CLOSE_SELECT_CONFIRM })
            }
          />
        </Dialog>
      </Box>
    </>
  );
};

export default News;
