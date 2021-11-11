import { useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import { APICp } from 'src/lib/api';
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
  master: CP_Master;
}

const initialState: CpMasterDetailState = {
  loading: false,
  master: {
    intro: '',
    keyword: '',
    nickname: '',
    profile_image_url: '',
    user: 0,
    created_at: '',
    id: 0,
  },
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
        master: payload,
        loading: false,
      };
  }
};

const CpMasterDetailContainer = () => {
  const { masterId } = useParams();
  const [cpMasterDetailState, dispatch] = useReducer(
    CpMasterDetailReducer,
    initialState,
  );

  const getCpMasterDetail = useCallback(async () => {
    dispatch({
      type: CpMasterDetailActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APICp.getMaster(masterId);
      if (status === 200) {
        dispatch({
          type: CpMasterDetailActionKind.GET_MASTER_DETAIL,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [masterId]);

  useEffect(() => {
    getCpMasterDetail();
  }, [getCpMasterDetail, masterId]);

  return (
    <CpMasterDetailPresenter
      cpMasterDetailState={cpMasterDetailState}
    />
  );
};

export default CpMasterDetailContainer;
