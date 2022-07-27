import { useEffect, useReducer } from 'react';
import { APITudalus } from 'src/lib/api';
import TudalusPresenter from './Tudalus.Presenter';

export enum TudalusActionKind {
  LOADING = 'LOADING',
  GET_SUBSCRIBER = 'GET_SUBSCRIBER',
}

export interface TudalusAction {
  type: TudalusActionKind;
  payload?: any;
}

export interface TudalusState {
  loading: boolean;
  subscriber: number;
}

const initialState: TudalusState = {
  loading: false,
  subscriber: 0,
};

const TudalusReducer = (
  state: TudalusState,
  action: TudalusAction,
): TudalusState => {
  const { type, payload } = action;
  switch (type) {
    case TudalusActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case TudalusActionKind.GET_SUBSCRIBER:
      return {
        ...state,
        loading: false,
        subscriber: payload,
      };
  }
};

const TudalusContainer = () => {
  const [tudalusState, dispatch] = useReducer(
    TudalusReducer,
    initialState,
  );

  // * 투달러스 총 구독자 수 가져오기
  const getTudalusSubscriber = async () => {
    try {
      const { data, status } =
        await APITudalus.getTudalusSubscriber();

      if (status === 200) {
        dispatch({
          type: TudalusActionKind.GET_SUBSCRIBER,
          payload: data,
        });
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  // * 투달러스 구독자 수 날짜별로 현황 파악하기
  const getTudalusSubscriberDate = async () => {
    try {
      const { data, status } =
        await APITudalus.getTudalusSubscriberDate();
      if (status === 200) {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getTudalusSubscriberDate();
    getTudalusSubscriber();
  }, []);

  return (
    <TudalusPresenter
      dispatch={dispatch}
      tudalusState={tudalusState}
    ></TudalusPresenter>
  );
};

export default TudalusContainer;
