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
import * as _ from 'lodash';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import { APIStock } from 'src/lib/api';
import {
  StockList,
  StockFormModal,
} from 'src/components/dashboard/stock';
import { AxiosError } from 'axios';

enum StockActionKind {
  LOADING = 'LOADING',
  ADD_STOCK = 'ADD_STOCK', // add stocks to existing news
  LOAD_STOCK = 'LOAD_STOCK', // first request || reload
  RELOAD_STOCK = 'RELOAD_STOCK', // first request || reload
  SHOW_FORM = 'SHOW_FORM',
  CLOSE_FORM = 'CLOSE_FORM',
  SET_TARGET = 'SET_TARGET',
  ERROR = 'ERROR',
}

interface StockAction {
  type: StockActionKind;
  payload?: any;
}

interface stockState {
  stocks: IStockDetailsWithTagCommentNews[];
  targetStock: IStockDetailsWithTagCommentNews;
  loading: boolean;
  isOpenForm: boolean;
  error: AxiosError<any> | boolean;
}

const initialState: stockState = {
  stocks: [],
  targetStock: null,
  isOpenForm: false,
  loading: true,
  error: null,
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
    case StockActionKind.RELOAD_STOCK:
      return {
        ...state,
        loading: false,
        stocks: state.stocks.map((stock) => {
          if (stock.code === payload.code) return payload;
          return stock;
        }),
        targetStock: payload,
      };
    case StockActionKind.ADD_STOCK:
      return {
        ...state,
        loading: false,
        stocks: [...state.stocks, ...payload],
      };

    case StockActionKind.SET_TARGET:
      return {
        ...state,
        targetStock: payload,
      };
    case StockActionKind.SHOW_FORM:
      return {
        ...state,
        isOpenForm: true,
      };
    case StockActionKind.CLOSE_FORM:
      return {
        ...state,
        isOpenForm: false,
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

  const {
    stocks: stockList,
    loading: stockListLoading,
    targetStock,
    error,
    isOpenForm,
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

  const reloadStock = useCallback(async (stockCode) => {
    try {
      const { data } = await APIStock.getDetails(stockCode);
      console.log('reaload stock', data);
      dispatch({
        type: StockActionKind.RELOAD_STOCK,
        payload: data[0],
      });
      console.log('heter');
      setShouldUpdate(false);
    } catch (error) {}
  }, []);

  const postStockComment = async (message, stock, dateTime) => {
    const { data, status } = await APIStock.postStockComment(
      message,
      stock,
      user.id,
      dateTime,
    );

    if (status === 200) {
      alert('success');
      reloadStock(stock);
    }
  };

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
        {isOpenForm && !_.isEmpty(targetStock) && (
          <StockFormModal
            //@ts-ignore
            stock={targetStock}
            isOpen={isOpenForm}
            postStockComment={postStockComment}
            reloadElement={reloadStock}
            setClose={() =>
              dispatch({ type: StockActionKind.CLOSE_FORM })
            }
          />
        )}
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
              setOpen={() =>
                dispatch({ type: StockActionKind.SHOW_FORM })
              }
              setTarget={(target: IStockDetailsWithTagCommentNews) =>
                dispatch({
                  type: StockActionKind.SET_TARGET,
                  payload: target,
                })
              }
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StockPage;
