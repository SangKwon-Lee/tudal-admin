import { useEffect, useReducer } from 'react';
import useAuth from 'src/hooks/useAuth';
import { APIMaster } from 'src/lib/api';
import { getMonthSubscription } from 'src/utils/getMonthSubscription';
import MasterSubscribePresenter from './MasterSubscribe.Presenter';

export enum MasterSubscribeActionKind {
  LOADING = 'LOADING',

  GET_ALL_SUBSCRIPTION_COUNT = 'GET_ALL_SUBSCRIPTION_COUNT',
  GET_SUBSCRIPTION = 'GET_SUBSCRIPTION',
  GET_THIS_MONTH = 'GET_THIS_MONTH',
  GET_YEAR = 'GET_YEAR',
  SELECT_YEAR = 'SELECT_YEAR',
}

export interface MasterSubscribeAction {
  type: MasterSubscribeActionKind;
  payload?: any;
}

export interface MasterSubscribeState {
  loading: boolean;
  subscription: any;
  selectYear: number;
  getYear: number[];
  allSubscription: number;
  thisMonth: number[];
}

const MasterSubscribeReducer = (
  state: MasterSubscribeState,
  action: MasterSubscribeAction,
): MasterSubscribeState => {
  const { type, payload } = action;
  switch (type) {
    case MasterSubscribeActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case MasterSubscribeActionKind.GET_SUBSCRIPTION:
      return {
        ...state,
        subscription: [
          {
            data: payload,
            name: '구독자 수',
          },
        ],
        loading: false,
      };
    case MasterSubscribeActionKind.GET_ALL_SUBSCRIPTION_COUNT:
      return {
        ...state,
        allSubscription: payload,
        loading: false,
      };
    case MasterSubscribeActionKind.GET_YEAR:
      return {
        ...state,
        getYear: payload,
        loading: false,
      };
    case MasterSubscribeActionKind.GET_THIS_MONTH:
      return {
        ...state,
        thisMonth: payload,
        loading: false,
      };
    case MasterSubscribeActionKind.SELECT_YEAR:
      return {
        ...state,
        selectYear: payload,
        loading: false,
      };
  }
};

const initialState: MasterSubscribeState = {
  loading: false,
  allSubscription: 0,
  subscription: [],
  selectYear: new Date().getFullYear(),
  getYear: [],
  thisMonth: [0, 0],
};

const MasterSubscribeContainer = () => {
  const [masterSubscribeState, dispatch] = useReducer(
    MasterSubscribeReducer,
    initialState,
  );
  const {
    user: { master },
  } = useAuth();

  const masterId = master?.id && master.id;

  useEffect(() => {
    if (masterId && master.id) {
      getSubscribeCount(master.id);
      getYear();
      getThisMonth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterId]);

  //* 총 구독자 수, 이번 년도 구독자 데이터
  const getSubscribeCount = async (masterId) => {
    dispatch({ type: MasterSubscribeActionKind.LOADING });
    try {
      const { status } = await APIMaster.getAllSubscribe(master.id);
      const response = await APIMaster.getYearSubscribe(
        masterSubscribeState.selectYear,
        masterId,
      );
      let endDate = response.map((data) => data.data);
      endDate = getMonthSubscription(
        endDate,
        masterSubscribeState.selectYear,
      );
      if (status === 200) {
        dispatch({
          type: MasterSubscribeActionKind.GET_ALL_SUBSCRIPTION_COUNT,
          payload: endDate[endDate.length - 1].length,
        });
        dispatch({
          type: MasterSubscribeActionKind.GET_SUBSCRIPTION,
          payload: endDate.map((data) => data.length),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 연도 불러오기
  const getYear = async () => {
    dispatch({ type: MasterSubscribeActionKind.LOADING });
    try {
      const { data, status } = await APIMaster.getAllSubscribe(
        master.id,
      );
      if (status === 200) {
        const FullYear = data.map((data) =>
          new Date(data.startDate).getFullYear(),
        );
        const FilterFullYear = FullYear.filter((data, index) => {
          return FullYear.indexOf(data) === index;
        });
        dispatch({
          type: MasterSubscribeActionKind.GET_YEAR,
          payload: FilterFullYear,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 연도 변경
  const handleChangeYear = async (event: any) => {
    try {
      const data = await APIMaster.getYearSubscribe(
        event.target.value,
        masterId,
      );
      let endDate = data.map((data) => data.data);
      endDate = getMonthSubscription(endDate, event.target.value);
      dispatch({
        type: MasterSubscribeActionKind.GET_SUBSCRIPTION,
        payload: endDate.map((data) => data.length),
      });
    } catch (error) {
      console.log(error);
    }
  };
  //* 이번 달, 지난 달 구독자 수
  const getThisMonth = async () => {
    try {
      const data = await APIMaster.getThisMonth(master.id);
      let endDate = data.map((data) => data.data);
      endDate = endDate.map((data) =>
        data.filter((data) => data.endDate === null),
      );
      dispatch({
        type: MasterSubscribeActionKind.GET_THIS_MONTH,
        payload: endDate.map((data) => data.length),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MasterSubscribePresenter
      masterSubscribeState={masterSubscribeState}
      dispatch={dispatch}
      handleChangeYear={handleChangeYear}
    />
  );
};

export default MasterSubscribeContainer;
