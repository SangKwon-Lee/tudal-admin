import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  createRef,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { INews } from 'src/types/news';
import axios from 'src/lib/axios';
import * as _ from 'lodash';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import ChevronRightIcon from '../../icons/ChevronRight';
import useSettings from '../../hooks/useSettings';
import {
  NewsCommentForm,
  NewsListTable,
} from 'src/components/dashboard/news';
import { APINews } from 'src/lib/api';
import { updateIsSelected } from 'src/lib/api/news.api';
import { AxiosError } from 'axios';

enum NewsActionKind {
  LOADING = 'LOADING',
  ADD_NEWS = 'ADD_NEWS',
  RELOAD_NEWS = 'SUCCRELOAD_NEWSESS',
  ERROR = 'ERROR',
}

interface NewsAction {
  type: NewsActionKind;
  payload?: any;
}

interface newsState {
  news: INews[];
  loading: boolean;
  error: AxiosError<any> | boolean;
}

const initialState: newsState = {
  news: [],
  loading: true,
  error: null,
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
    case NewsActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
  }
};

const News: React.FC = () => {
  const { settings } = useSettings();
  const [newsState, dispatch] = useReducer(newsReducer, initialState);
  const [search, setSearch] = useState<string>('');
  const [tick, setTick] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [minutesRefresh, setMinutesRefresh] = useState<number>(3);
  const [isOpen, setOpen] = useState(false);
  const [targetNews, setTargetNews] = useState<INews>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { news: newsList, loading: newsLoading } = newsState;

  const handleSearch = _.debounce(setSearch, 300);

  const handleOpenForm = useCallback(
    () => setOpen((prev) => !prev),
    [],
  );
  const getNews = useCallback(async () => {
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
    getNews();
  }, [getNews]);

  useEffect(() => {
    addNews();
  }, [addNews]);

  useEffect(() => {
    scrollRef && scrollRef.current.scrollIntoView();
  }, [page]);

  const updateSelect = async (news: INews) => {
    await updateIsSelected(news.id, news.isSelected);
    getNews();
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
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        {isOpen && targetNews.id && (
          <NewsCommentForm
            isOpen={isOpen}
            setOpen={handleOpenForm}
            news={targetNews}
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
              reload={getNews}
              isLoading={newsLoading}
              updateSelect={updateSelect}
              page={page}
              setPage={handlePageChange}
              limit={limit}
              setLimit={setLimit}
              isOpenForm={isOpen}
              setOpenForm={handleOpenForm}
              setTargetNews={setTargetNews}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default News;
