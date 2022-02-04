import { useCallback, useEffect, useReducer } from 'react';
import { IStockComment } from 'src/types/stock';
import { APIStock } from 'src/lib/api';
import StockCommentListPresenter from './StockCommentList.Presenter';

export enum StockListActionKind {
  LOADING = 'LOADING',
  LOAD_STOCKTAG = 'LOAD_STOCKTAG',
  CHANGE_PAGE = 'CHANGE_PAGE',
}

export interface StockListAction {
  type: StockListActionKind;
  payload?: any;
}

export interface StockListState {
  stockComments: IStockComment[];
  stockCommentLength: number;
  loading: boolean;
  start: number;
  limit: number;
  page: number;
}

const initialState: StockListState = {
  stockComments: [],
  stockCommentLength: null,
  loading: true,
  start: 0,
  limit: 50,
  page: 1,
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
        loading: payload,
      };
    case StockListActionKind.LOAD_STOCKTAG:
      return {
        ...state,
        stockComments: payload.data,
        stockCommentLength: payload.length,
      };
    case StockListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload.page,
        start: payload.start,
      };
  }
};

const StockCommentListContainer = () => {
  const [stockState, dispatch] = useReducer(
    stockReducer,
    initialState,
  );

  const {
    stockComments,
    loading,
    page,
    start,
    limit,
    stockCommentLength,
  } = stockState;

  const getStockTag = useCallback(async () => {
    dispatch({ type: StockListActionKind.LOADING, payload: true });
    try {
      const { data } = await APIStock.getStockComment(start, limit);

      const { data: count } = await APIStock.getStockCommentLength();
      dispatch({
        type: StockListActionKind.LOAD_STOCKTAG,
        payload: { data: data, length: count },
      });
      dispatch({ type: StockListActionKind.LOADING, payload: false });
    } catch (error) {
      console.error(error);
    }
  }, [start, limit]);

  const changePage = (page) => {
    dispatch({
      type: StockListActionKind.CHANGE_PAGE,
      payload: { start: (page - 1) * limit, page },
    });
  };

  useEffect(() => {
    getStockTag();
  }, [getStockTag]);

  return (
    <StockCommentListPresenter
      stockComments={stockComments}
      loading={loading}
      page={page}
      length={stockCommentLength}
      limit={limit}
      onPageChange={changePage}
    />
  );
};

export default StockCommentListContainer;
