import { useCallback, useEffect, useReducer } from 'react';
import { APIHR } from 'src/lib/api';

import { IHR } from 'src/types/hiddenreport';
import HiddenreportListPresenter from './HiddenreportList.Presenter';

export enum HRListActionKind {
  LOADING = 'LOADING',
  LOAD_REPORTS = 'LOAD_REPORTS',
  SELECT_TARGET = 'SELECT_TARGET',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',

  // QUERY/
  CHANGE_QUERY = 'CHANG_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
}

type Sort =
  | 'created_at:desc'
  | 'created_at:asc'
  | 'expirationDate:asc'
  | 'expirationDate:desc';

interface SortOption {
  value: Sort;
  label: string;
}
export const sortOptions: SortOption[] = [
  {
    label: '등록순 (최신)',
    value: 'created_at:desc',
  },
  {
    label: '등록순 (오래된)',
    value: 'created_at:asc',
  },
  {
    label: '만료일 (최신)',
    value: 'expirationDate:desc',
  },
  {
    label: '만료일 (오래된)',
    value: 'expirationDate:asc',
  },
];

export interface IHRListAction {
  type: HRListActionKind;
  payload?: any;
}

export interface IHRListState {
  list: IHR[];
  listLength: number;
  loading: boolean;
  targetSelect: IHR;
  isOpenConfirm: boolean;
  page: number;
  query: {
    _q: string;
    _start: number;
    _limit: number;
    _sort: string;
  };
}

const initialState: IHRListState = {
  list: [],
  listLength: 0,
  targetSelect: null,
  loading: true,
  page: 1,
  isOpenConfirm: false,
  query: {
    _q: '',
    _start: 0,
    _limit: 20,
    _sort: sortOptions[0].value,
  },
};

const HRListReducer = (
  state: IHRListState,
  action: IHRListAction,
): IHRListState => {
  const { type, payload } = action;
  switch (type) {
    case HRListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case HRListActionKind.LOAD_REPORTS:
      return {
        ...state,
        loading: false,
        list: payload.data,
        listLength: payload.count,
      };

    case HRListActionKind.SELECT_TARGET:
      return {
        ...state,
        targetSelect: payload,
      };

    case HRListActionKind.CHANGE_QUERY:
      const { name, value } = payload;
      return {
        ...state,
        page: 1,
        query: {
          ...state.query,
          [name]: value,
        },
      };
    case HRListActionKind.CLOSE_SELECT_CONFIRM:
      return {
        ...state,
        targetSelect: null,
      };
    case HRListActionKind.CHANGE_PAGE:
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

const HiddenReportList: React.FC = (props) => {
  const [HRListState, dispatch] = useReducer(
    HRListReducer,
    initialState,
  );

  const { query } = HRListState;

  const getList = useCallback(async () => {
    try {
      const { data, status } = await APIHR.getList(query);
      if (data.length && status === 200) {
        const { data: count } = await APIHR.getListLength(query);

        dispatch({
          type: HRListActionKind.LOAD_REPORTS,
          payload: { data, count },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [query]);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <HiddenreportListPresenter
      state={HRListState}
      dispatch={dispatch}
    />
  );
};

export default HiddenReportList;
