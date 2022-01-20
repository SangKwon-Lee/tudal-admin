import { useCallback, useEffect, useReducer } from 'react';
import { IStockTags } from 'src/types/stock';
import { APIStock } from 'src/lib/api';
import StockTagListPresenter from './StockTagList.Presenter';

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
  stockTags: IStockTags[];
  stockTagsLength: number;
  loading: boolean;
  page: number;
  limit: 50;
}

const initialState: StockListState = {
  stockTags: [],
  stockTagsLength: null,
  loading: true,
  page: 1,
  limit: 50,
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
        stockTags: payload.data,
        stockTagsLength: payload.length,
      };
    case StockListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
      };
  }
};

const StockTagListContainer = () => {
  const [stockState, dispatch] = useReducer(
    stockReducer,
    initialState,
  );

  const { stockTags, loading, page, limit, stockTagsLength } =
    stockState;

  const getStockTag = useCallback(async () => {
    dispatch({ type: StockListActionKind.LOADING, payload: true });
    try {
      const { data } = await APIStock.getStockTags(page - 1, limit);
      dispatch({
        type: StockListActionKind.LOAD_STOCKTAG,
        payload: { data: data.list, length: data.totalRows.count },
      });
      dispatch({ type: StockListActionKind.LOADING, payload: false });
    } catch (error) {
      console.error(error);
    }
  }, [page, limit]);

  const changePage = (page) => {
    dispatch({
      type: StockListActionKind.CHANGE_PAGE,
      payload: page,
    });
  };

  useEffect(() => {
    getStockTag();
  }, [getStockTag]);

  return (
    <StockTagListPresenter
      stockTags={stockTags}
      loading={loading}
      page={page}
      length={stockTagsLength}
      limit={limit}
      onPageChange={changePage}
    />
  );
};

export default StockTagListContainer;
