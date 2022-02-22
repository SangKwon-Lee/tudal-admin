import dayjs from 'dayjs';
import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAuth from 'src/hooks/useAuth';
import { APIHR } from 'src/lib/api';
import { IHR, IHROrders } from 'src/types/hiddenreport';
import HiddenReportStatPresenter from './HiddenreportStat.Presenter';

export enum HRStatActionKind {
  LOADING = 'LOADING',
  GET_PAYMENTS = 'GET_PAYMENTS',
  LOAD_ORDERS = 'LOAD_ORDERS',
  LOAD_REPORT_MAP = 'LOAD_REPORT_MAP',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_FREE_PAGE = 'CHANGE_FREE_PAGE',
  CHANGE_ORDER_PAGE = 'CHANGE_ORDER_PAGE',
  CHANGE_REPORT_PAGE = 'CHANGE_REPORT_PAGE',
  CHANGE_STARTDATE = 'CHANGE_STARTDATE',
  CHANGE_ENDDATE = 'CHANGE_ENDDATE',
}

export interface HRStatAction {
  type: HRStatActionKind;
  payload?: any;
}

interface IReportMap {
  hidden_report: IHR;
  count: number;
}
export interface IHRStatState {
  loading: boolean;
  orders: IHROrders[];
  reportMap: { [key: number]: IReportMap };
  orderPage: number;
  orderLimit: number;
  reportPage: number;
  reportLimit: number;
  page: number;
  query: {
    _start: number;
    _limit: number;
    startDate: string;
    endDate: string;
  };
  payments: {
    freeReports: [];
    paidReports: [];
    totalIncome: number;
    totalSellCount: number;
  };
  freeReportsPage: {
    page: number;
    _start: number;
    _limit: number;
  };
}

const HRStatReducer = (
  state: IHRStatState,
  action: HRStatAction,
): IHRStatState => {
  const { type, payload } = action;
  switch (type) {
    case HRStatActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case HRStatActionKind.LOAD_ORDERS:
      return {
        ...state,
        orders: payload,
      };
    case HRStatActionKind.GET_PAYMENTS:
      return {
        ...state,
        payments: payload,
      };
    case HRStatActionKind.LOAD_REPORT_MAP:
      return {
        ...state,
        reportMap: payload,
        loading: false,
      };
    case HRStatActionKind.CHANGE_REPORT_PAGE:
      return {
        ...state,
        reportPage: payload,
      };
    case HRStatActionKind.CHANGE_ORDER_PAGE:
      return {
        ...state,
        orderPage: payload,
      };
    case HRStatActionKind.CHANGE_STARTDATE: {
      return {
        ...state,
        query: {
          ...state.query,
          startDate: payload,
        },
      };
    }
    case HRStatActionKind.CHANGE_ENDDATE: {
      return {
        ...state,
        query: {
          ...state.query,
          endDate: payload,
        },
      };
    }
    case HRStatActionKind.CHANGE_PAGE: {
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * state.query._limit,
          _limit: payload * 20,
        },
      };
    }
    case HRStatActionKind.CHANGE_FREE_PAGE: {
      return {
        ...state,
        freeReportsPage: {
          ...state.freeReportsPage,
          page: payload,
          _start: (payload - 1) * state.query._limit,
          _limit: payload * 20,
        },
      };
    }
  }
};

const initialState: IHRStatState = {
  loading: true,
  orders: [],
  reportMap: {},
  orderPage: 0,
  orderLimit: 10,
  reportPage: 0,
  reportLimit: 3,
  page: 0,
  query: {
    _start: 0,
    _limit: 20,
    startDate: dayjs('2020-01-01').format('YYYY-MM-DD'),
    endDate: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
  },
  payments: {
    freeReports: [],
    paidReports: [],
    totalIncome: 0,
    totalSellCount: 0,
  },
  freeReportsPage: {
    page: 0,
    _start: 0,
    _limit: 20,
  },
};

const HiddenReportStatContainer: React.FC = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [HRStatState, dispatch] = useReducer(
    HRStatReducer,
    initialState,
  );

  const getReportOrders = useCallback(async () => {
    try {
      const { data } = await APIHR.getHiddenReportOrders(
        user?.hidden_reporter?.id,
        HRStatState.query,
      );
      dispatch({
        type: HRStatActionKind.GET_PAYMENTS,
        payload: data,
      });
      console.log(data);
      dispatch({
        type: HRStatActionKind.LOADING,
        payload: false,
      });
    } catch (e) {
      console.log(e);
    }
  }, [HRStatState.query, user?.hidden_reporter?.id]);

  useEffect(() => {
    getReportOrders();
  }, [getReportOrders]);

  useEffect(() => {
    if (user && !user.hidden_reporter?.id) {
      navigate('/dashboard');
      toast.error('리포터를 먼저 생성해주세요');
    }
  }, [user, navigate]);

  return (
    <HiddenReportStatPresenter
      state={HRStatState}
      dispatch={dispatch}
    />
  );
};

export default HiddenReportStatContainer;
