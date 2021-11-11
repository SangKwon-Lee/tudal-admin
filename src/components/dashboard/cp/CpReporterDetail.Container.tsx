import { useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import { APICp } from 'src/lib/api';
import { CP_Hidden_Reporter } from 'src/types/cp';
import CpReporterDetailPresenter from './CpReporterDetail.Presenter';
export enum CpReporterDetailActionKind {
  LOADING = 'LOADING',
  GET_REPORTER_DETAIL = 'GET_REPORTER_DETAIL',
}
export interface CpReporterDetailAction {
  type: CpReporterDetailActionKind;
  payload?: any;
}
export interface CpReporterDetailState {
  loading: boolean;
  reporter: CP_Hidden_Reporter;
}

const initialState: CpReporterDetailState = {
  loading: false,
  reporter: {
    intro: '',
    nickname: '',
    imageUrl: '',
    user: 0,
    created_at: '',
    id: 0,
    catchPhrase: '',
    tudalRecommendScore: 0,
  },
};
const CpReporterDetailReducer = (
  state: CpReporterDetailState,
  action: CpReporterDetailAction,
): CpReporterDetailState => {
  const { type, payload } = action;
  switch (type) {
    case CpReporterDetailActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CpReporterDetailActionKind.GET_REPORTER_DETAIL:
      return {
        ...state,
        reporter: payload,
        loading: false,
      };
  }
};

const CpReporterDetailContainer = () => {
  const { reporterId } = useParams();
  const [cpReporterDetailState, dispatch] = useReducer(
    CpReporterDetailReducer,
    initialState,
  );

  //* 디테일 정보 불러오기
  const getCpReporterDetail = useCallback(async () => {
    dispatch({
      type: CpReporterDetailActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APICp.getReporter(reporterId);
      if (status === 200) {
        dispatch({
          type: CpReporterDetailActionKind.GET_REPORTER_DETAIL,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [reporterId]);

  useEffect(() => {
    getCpReporterDetail();
  }, [getCpReporterDetail, reporterId]);

  return (
    <CpReporterDetailPresenter
      cpReporterDetailState={cpReporterDetailState}
    />
  );
};

export default CpReporterDetailContainer;
