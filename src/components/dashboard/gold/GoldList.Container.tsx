import React, { useEffect, useCallback, useReducer } from 'react';
import { IGoldLedger } from 'src/types/gold';
import { APIGold } from 'src/lib/api';
import GoldListPresenter from './GoldList.Presenter';

interface IGoldListContainerProps {
  pageTopRef: React.RefObject<HTMLDivElement>;
}

export enum GoldListActionKind {
  LOADING = 'LOADING',

  LOAD_LIST = 'LOAD_LIST',
  LOAD_COUNT = 'LOAD_COUNT',

  // delte
  SHOW_DELETE_DIALOG = 'SHOW_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',

  // page / sort
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_SORT = 'CHANGE_SORT',
  CHANGE_SEARCH = 'CHANGE_SEARCH',
  CHANGE_STARTDATE = 'CHANGE_STARTDATE',
  CHANGE_ENDDATE = 'CHANGE_ENDDATE',
}

export interface IGoldListAction {
  type: GoldListActionKind;
  payload?: any;
}

type Sort =
  | 'datetime:desc'
  | 'datetime:asc'
  | 'amount:desc'
  | 'amount:asc'
  | 'bonusAmount:desc'
  | 'bonusAmount:asc';

export interface ISortOption {
  value: Sort;
  label: string;
}

const sortOptions: ISortOption[] = [
  {
    label: '최신 등록순',
    value: 'datetime:desc',
  },
  {
    label: '오래된 등록순',
    value: 'datetime:asc',
  },
  {
    label: '금액 내림차순',
    value: 'amount:desc',
  },
  {
    label: '금액 오름차순',
    value: 'amount:asc',
  },
  {
    label: '보너스 금액 내림차순',
    value: 'bonusAmount:desc',
  },
  {
    label: '보너스 금액 오름차순',
    value: 'bonusAmount:asc',
  },
];

export interface IGoldListQuery {
  searchWord: string;
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  sortContents: string;
  sortType: string;
}

export interface IGoldListState {
  list: IGoldLedger[];
  listLength: number;
  loading: boolean;
  isOpenConfirm: boolean;
  query: IGoldListQuery;
}

const initialState: IGoldListState = {
  list: [],
  listLength: 0,
  loading: true,
  isOpenConfirm: false,
  query: {
    searchWord: '',
    page: 0,
    limit: 20,
    sortContents: sortOptions[0].value.split(':')[0],
    sortType: sortOptions[0].value.split(':')[1],
    startDate: '',
    endDate: '',
  },
};

const goldListReducer = (
  state: IGoldListState,
  action: IGoldListAction,
): IGoldListState => {
  const { type, payload } = action;

  switch (type) {
    case GoldListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case GoldListActionKind.LOAD_LIST:
      return {
        ...state,
        loading: false,
        list: payload.histories,
        listLength: payload.count,
      };
    case GoldListActionKind.LOAD_COUNT:
      return {
        ...state,
        listLength: payload,
      };

    case GoldListActionKind.CHANGE_SEARCH:
      return {
        ...state,
        query: {
          ...state.query,
          searchWord: payload,
        },
      };
    case GoldListActionKind.CHANGE_PAGE:
      return {
        ...state,
        query: {
          ...state.query,
          page: payload,
        },
      };
    case GoldListActionKind.CHANGE_SORT:
      const [contents, type] = payload.split(':');
      return {
        ...state,
        query: {
          ...state.query,
          sortContents: contents,
          sortType: type,
        },
      };
  }
};

const GoldListContainer: React.FC<IGoldListContainerProps> = (
  props,
) => {
  const { pageTopRef } = props;
  const [goldListState, dispatch] = useReducer(
    goldListReducer,
    initialState,
  );

  const getList = useCallback(async () => {
    try {
      dispatch({ type: GoldListActionKind.LOADING });
      const { data, status } = await APIGold.getLegderList(
        goldListState.query,
      );
      if (status === 200) {
        dispatch({
          type: GoldListActionKind.LOAD_LIST,
          payload: data,
        });
        pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.log(error);
    }
  }, [goldListState.query, pageTopRef]);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <GoldListPresenter
      state={goldListState}
      dispatch={dispatch}
      sortOptions={sortOptions}
    />
  );
};

export default GoldListContainer;
