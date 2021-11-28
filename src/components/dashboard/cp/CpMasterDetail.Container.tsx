import { useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import { APICp, APIMaster } from 'src/lib/api';
import { CP_Master } from 'src/types/cp';
import CpMasterDetailPresenter from './CpMasterDetail.Presenter';
export enum CpMasterDetailActionKind {
  LOADING = 'LOADING',
  GET_MASTER_DETAIL = 'GET_MASTER_DETAIL',
}
export interface CpMasterDetailAction {
  type: CpMasterDetailActionKind;
  payload?: any;
}
export interface CpMasterDetailState {
  loading: boolean;
  masters: CP_Master[];
}

const initialState: CpMasterDetailState = {
  loading: false,
  masters: [],
};
const CpMasterDetailReducer = (
  state: CpMasterDetailState,
  action: CpMasterDetailAction,
): CpMasterDetailState => {
  const { type, payload } = action;
  switch (type) {
    case CpMasterDetailActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CpMasterDetailActionKind.GET_MASTER_DETAIL:
      return {
        ...state,
        masters: payload,
        loading: false,
      };
  }
};

const CpMasterDetailContainer = () => {
  const { userId } = useParams();
  console.log(useParams());
  const [cpMasterDetailState, dispatch] = useReducer(
    CpMasterDetailReducer,
    initialState,
  );

  //* 디테일 정보 불러오기
  const getCpMasterDetail = useCallback(async () => {
    dispatch({
      type: CpMasterDetailActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APIMaster.getMasters(userId);

      if (status === 200) {
        dispatch({
          type: CpMasterDetailActionKind.GET_MASTER_DETAIL,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  useEffect(() => {
    getCpMasterDetail();
  }, [getCpMasterDetail]);

  console.log(cpMasterDetailState);
  return (
    <CpMasterDetailPresenter
      cpMasterDetailState={cpMasterDetailState}
    />
  );
};

export default CpMasterDetailContainer;
