import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAuth from 'src/hooks/useAuth';
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
          _start: 0,
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

const HiddenReportListContainer: React.FC = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [HRListState, dispatch] = useReducer(
    HRListReducer,
    initialState,
  );

  const { query } = HRListState;

  const getList = useCallback(async () => {
    try {
      const _query = {
        ...query,
        hidden_reporter: user.hidden_reporter.id,
      };
      const { data, status } = await APIHR.getList(_query);
      if (status === 200) {
        const { data: count } = await APIHR.getListLength(_query);
        dispatch({
          type: HRListActionKind.LOAD_REPORTS,
          payload: { data, count },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [query, user?.hidden_reporter?.id]);

  const deleteReport = useCallback(
    async (id) => {
      try {
        const { data: orderList } = await APIHR.getOrdersByReport(id);
        console.log('hasdasd', orderList);
        if (orderList.length) {
          toast.error(
            '이미 구매한 사용자가 있어 삭제가 불가능합니다. 관리자에게 문의 부탁드립니다.',
          );
          return;
        }
        const { status } = await APIHR.remove(id);

        if (status === 200) {
          toast.success('성공했습니다.');
          getList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [getList],
  );

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (user && !user.hidden_reporter?.id) {
      navigate('/dashboard');
      toast.error('리포터를 먼저 생성해주세요');
    }
  }, [user, navigate]);

  return (
    <HiddenreportListPresenter
      state={HRListState}
      dispatch={dispatch}
      deleteReport={deleteReport}
    />
  );
};

export default HiddenReportListContainer;
