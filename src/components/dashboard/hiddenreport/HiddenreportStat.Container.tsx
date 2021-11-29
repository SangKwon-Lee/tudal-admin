import { useCallback, useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { APIHR } from 'src/lib/api';
import { IHR, IHROrders } from 'src/types/hiddenreport';
import HiddenReportStatPresenter from './HiddenreportStat.Presenter';

export enum HRStatActionKind {
  LOADING = 'LOADING',
  LOAD_ORDERS = 'LOAD_ORDERS',
  LOAD_REPORT_MAP = 'LOAD_REPORT_MAP',
  CHANGE_ORDER_PAGE = 'CHANGE_ORDER_PAGE',
  CHANGE_REPORT_PAGE = 'CHANGE_REPORT_PAGE',
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
};

const orderListToMap = (orders: IHROrders[]) => {
  const map: { [key: number]: IReportMap } = {};

  orders.forEach(({ hidden_report }) => {
    if (!map[hidden_report.id]) {
      map[hidden_report.id] = {
        count: 0,
        hidden_report: hidden_report,
      };
    } else {
      map[hidden_report.id].count++;
    }
  });
  return map;
};

const HiddenReportStatContainer: React.FC = (props) => {
  const {
    user: { hidden_reporter },
  } = useAuth();

  const [HRStatState, dispatch] = useReducer(
    HRStatReducer,
    initialState,
  );

  const getOrders = useCallback(async () => {
    try {
      const { data, status } = await APIHR.getOrders(
        hidden_reporter.id,
      );
      if (status === 200) {
        dispatch({
          type: HRStatActionKind.LOAD_ORDERS,
          payload: data,
        });
        dispatch({
          type: HRStatActionKind.LOAD_REPORT_MAP,
          payload: orderListToMap(data),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [hidden_reporter]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <HiddenReportStatPresenter
      state={HRStatState}
      dispatch={dispatch}
    />
  );
};

export default HiddenReportStatContainer;
