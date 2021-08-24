import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
} from 'react';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  Dialog,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import ChevronRightIcon from 'src/icons/ChevronRight';
import useSettings from 'src/hooks/useSettings';
import useAuth from 'src/hooks/useAuth';
import useMounted from 'src/hooks/useMounted';

import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import { APIStock } from 'src/lib/api';
import { StockList, StockForm } from 'src/components/dashboard/stock';
import useAsync from 'src/hooks/useAsync';
import { AxiosError } from 'axios';

enum StockActionKind {
  LOADING = 'LOADING',
  ADD_STOCK = 'ADD_STOCK', // add stocks to existing news
  LOAD_STOCK = 'LOAD_STOCK', // first request || reload
  SHOW_SELECT_CONFIRM = 'SHOW_SELECT_CONFIRM',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',
  ERROR = 'ERROR',
}

interface StockAction {
  type: StockActionKind;
  payload?: any;
}

interface stockState {
  stocks: IStockDetailsWithTagCommentNews[];
  loading: boolean;
  isOpenConfirm: boolean;
  error: AxiosError<any> | boolean;
}

const initialState: stockState = {
  stocks: [],
  loading: true,
  error: null,
  isOpenConfirm: false,
};

const stockReducer = (
  state: stockState,
  action: StockAction,
): stockState => {
  const { type, payload } = action;

  switch (type) {
    case StockActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case StockActionKind.LOAD_STOCK:
      return {
        ...state,
        loading: false,
        stocks: payload,
      };
    case StockActionKind.ADD_STOCK:
      return {
        ...state,
        loading: false,
        stocks: [...state.stocks, ...payload],
      };
    case StockActionKind.SHOW_SELECT_CONFIRM:
      return {
        ...state,
        isOpenConfirm: true,
      };
    case StockActionKind.CLOSE_SELECT_CONFIRM:
      return {
        ...state,
        isOpenConfirm: false,
      };

    case StockActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
  }
};

const StockPage = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [stockState, dispatch] = useReducer(
    stockReducer,
    initialState,
  );
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const mounted = useMounted();

  const {
    stocks: stockList,
    loading: stockListLoading,
    error,
    isOpenConfirm,
  } = stockState;

  const handlePageChange = (event: any, newPage: number): void => {
    if ((page + 1) * limit >= stockList.length - limit) {
      setShouldUpdate(true);
    }
    setPage(newPage);
  };

  const loadStock = useCallback(async () => {
    dispatch({ type: StockActionKind.LOADING });
    try {
      const { data } = await APIStock.getListDetails(search);
      dispatch({
        type: StockActionKind.LOAD_STOCK,
        payload: data,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: StockActionKind.ERROR, payload: error });
    }
  }, [search]);

  const addStock = useCallback(async () => {
    if (!shouldUpdate) return;
    try {
      const { data } = await APIStock.getListDetails(
        search,
        stockList.length,
      );

      dispatch({ type: StockActionKind.ADD_STOCK, payload: data });
      setShouldUpdate(false);
    } catch (error) {}
  }, [page, stockList]);

  useEffect(() => {
    addStock();
  }, [addStock]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

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
        {false && <StockForm></StockForm>}
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                종목 리스트
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
                  종목 관리
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <StockList
              list={stockList}
              page={page}
              search={search}
              loading={stockListLoading}
              limit={limit}
              setLimit={setLimit}
              setPage={handlePageChange}
              setSearch={setSearch}
              reload={loadStock}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StockPage;
