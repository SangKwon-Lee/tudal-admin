import { useCallback, useEffect, useReducer } from 'react';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import StockListPresenter from './StockList.Presenter';
import { APIStock } from 'src/lib/api';

export enum StockListActionKind {
  LOADING = 'LOADING',
  LOAD_STOCK = 'LOAD_STOCK',
  ADD_STOCK = 'ADD_STOCK', // add stocks to existing news
  GET_STOCK = 'GET_STOCK', // first request || reload
  RELOAD_STOCK = 'RELOAD_STOCK', // first request || reload
  SHOW_FORM = 'SHOW_FORM',
  CLOSE_FORM = 'CLOSE_FORM',
  SET_TARGET = 'SET_TARGET',
  CHANGE_SHOULDUPDATE = 'CHANGE_SHOULDUPDATE',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_COMMENTPAGE = 'CHANGE_COMMENTPAGE',
  CHANGE_NEWSPAGE = 'CHANGE_NEWSPAGE',
}

export interface StockListAction {
  type: StockListActionKind;
  payload?: any;
}

export interface StockListState {
  stocks: IStockDetailsWithTagCommentNews[];
  targetStock: IStockDetailsWithTagCommentNews;
  loading: boolean;
  isOpenForm: boolean;
  shouldUpdate: boolean;
  query: {
    _start: number;
    _limit: number;
    _q: string;
  };
  page: number;
  commentPage: number;
  newsPage: number;
}

const initialState: StockListState = {
  stocks: [],
  targetStock: null,
  isOpenForm: false,
  loading: true,
  shouldUpdate: false,
  query: {
    _q: '',
    _start: 0,
    _limit: 30,
  },
  page: 0,
  commentPage: 0,
  newsPage: 0,
};

const stockReducer = (
  state: StockListState,
  action: StockListAction,
): StockListState => {
  const { type, payload } = action;
  switch (type) {
    case StockListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case StockListActionKind.GET_STOCK:
      return {
        ...state,
        loading: false,
        stocks: payload,
      };
    case StockListActionKind.LOAD_STOCK:
      return {
        ...state,
        loading: false,
        stocks: payload,
      };
    case StockListActionKind.RELOAD_STOCK:
      return {
        ...state,
        loading: false,
        stocks: state.stocks.map((stock) => {
          if (stock.code === payload.code) return payload;
          return stock;
        }),
        targetStock: payload,
      };
    case StockListActionKind.ADD_STOCK:
      return {
        ...state,
        loading: false,
        stocks: [...state.stocks, ...payload],
      };

    case StockListActionKind.SET_TARGET:
      return {
        ...state,
        targetStock: payload,
      };
    case StockListActionKind.SHOW_FORM:
      return {
        ...state,
        isOpenForm: true,
      };
    case StockListActionKind.CLOSE_FORM:
      return {
        ...state,
        isOpenForm: false,
      };
    case StockListActionKind.CHANGE_SHOULDUPDATE:
      return {
        ...state,
        shouldUpdate: true,
      };
    case StockListActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
      };
    case StockListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 30,
        },
      };
    case StockListActionKind.CHANGE_COMMENTPAGE:
      return {
        ...state,
        commentPage: payload,
      };
    case StockListActionKind.CHANGE_NEWSPAGE:
      return {
        ...state,
        newsPage: payload,
      };
  }
};

const StockListContainer = () => {
  const [stockState, dispatch] = useReducer(
    stockReducer,
    initialState,
  );

  const getStock = async () => {
    dispatch({ type: StockListActionKind.LOADING });
    try {
      const { data } = await APIStock.getDetailList(stockState.query);
      dispatch({
        type: StockListActionKind.GET_STOCK,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadStock = async () => {
    dispatch({ type: StockListActionKind.LOADING });
    try {
      const { data } = await APIStock.getDetailList(stockState.query);
      dispatch({
        type: StockListActionKind.LOAD_STOCK,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addStock = useCallback(async () => {
    if (!stockState.shouldUpdate) return;
    try {
      const { data } = await APIStock.getDetailList(stockState.query);
      dispatch({
        type: StockListActionKind.ADD_STOCK,
        payload: data,
      });
      dispatch({ type: StockListActionKind.CHANGE_SHOULDUPDATE });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockState.stocks, stockState.query, stockState.shouldUpdate]);

  const reloadStock = useCallback(async (stockCode) => {
    try {
      const { data } = await APIStock.getDetail(stockCode);
      dispatch({
        type: StockListActionKind.RELOAD_STOCK,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handlePageChange = (event: any, newPage: number): void => {
    if (
      (stockState.page + 1) * stockState.query._limit >=
      stockState.stocks.length - stockState.query._limit
    ) {
      dispatch({
        type: StockListActionKind.CHANGE_SHOULDUPDATE,
        payload: true,
      });
    }
    dispatch({
      type: StockListActionKind.CHANGE_PAGE,
      payload: newPage,
    });
  };

  useEffect(() => {
    addStock();
  }, [addStock]);

  useEffect(() => {
    getStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StockListPresenter
      stockState={stockState}
      dispatch={dispatch}
      loadStock={loadStock}
      reloadStock={reloadStock}
      handlePageChange={handlePageChange}
    />
  );
};

export default StockListContainer;
