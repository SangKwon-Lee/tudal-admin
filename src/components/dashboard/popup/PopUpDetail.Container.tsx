import { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APICp, APIHR, APIPopUp } from 'src/lib/api';
import { IPopUp } from 'src/types/popup';
import PopUpDetailPresenter from './PopUpDetail.Presenter';

export enum PopUpDetailActionKind {
  LOADING = 'LOADING',
  GET_POPUP = 'GET_POPUP',
  MODAL_OPEN = 'MODAL_OPEN',
  MODAL_CLOSE = 'MODAL_CLOSE',
  GET_TARGET_DETAIL = 'GET_TARGET_DETAIL',
}

export interface PopUpDetailAction {
  type: PopUpDetailActionKind;
  payload?: any;
}

export interface PopUpDetailState {
  loading: boolean;
  popUp: IPopUp;
  openModal: boolean;
  targetDetail: any;
}

const initialState: PopUpDetailState = {
  loading: false,
  popUp: {
    id: 0,
    title: '',
    description: '',
    order: null,
    openTime: '',
    closeTime: '',
    image: '',
    target: '',
    target_id: null,
  },
  targetDetail: {},
  openModal: false,
};

const PopUpDetailReducer = (
  state: PopUpDetailState,
  action: PopUpDetailAction,
): PopUpDetailState => {
  const { type, payload } = action;
  switch (type) {
    case PopUpDetailActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case PopUpDetailActionKind.GET_POPUP:
      return {
        ...state,
        popUp: payload,
      };
    case PopUpDetailActionKind.MODAL_OPEN:
      return {
        ...state,
        openModal: true,
      };
    case PopUpDetailActionKind.MODAL_CLOSE:
      return {
        ...state,
        openModal: false,
      };
    case PopUpDetailActionKind.GET_TARGET_DETAIL:
      return {
        ...state,
        targetDetail: payload,
      };
  }
};

const PopUpDetailContainer = () => {
  console.log('rendering');
  const [PopUpDetailState, dispatch] = useReducer(
    PopUpDetailReducer,
    initialState,
  );
  const { popupId } = useParams();
  const navigate = useNavigate();
  const getPopUpDetail = async () => {
    dispatch({ type: PopUpDetailActionKind.LOADING, payload: true });
    try {
      const { data, status } = await APIPopUp.getPopUp(popupId);
      if (status === 200) {
        dispatch({
          type: PopUpDetailActionKind.GET_POPUP,
          payload: data,
        });
      }

      const { target, target_id } = data;
      let targetDetail;

      switch (target) {
        case 'master':
          const { data: master } = await APICp.getMaster(target_id);
          targetDetail = {
            id: master.id,
            value: master.nickname,
            subValue: master.user?.username || '',
          };
          break;
        case 'hidden_report':
          const { data: report } = await APIHR.get(target_id);
          targetDetail = {
            id: report.id,
            value: report.title,
            subValue: report.hidden_reporter?.nickname || '',
          };

          break;
        case 'hidden_reporter':
          const { data: reporter } = await APICp.getReporter(
            target_id,
          );
          targetDetail = {
            id: reporter.id,
            value: reporter.nickname,
            subValue: reporter.user?.username || '',
          };
          break;
      }
      dispatch({
        type: PopUpDetailActionKind.GET_TARGET_DETAIL,
        payload: targetDetail,
      });
      dispatch({
        type: PopUpDetailActionKind.LOADING,
        payload: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePopUp = async () => {
    try {
      const { status } = await APIPopUp.deletePopup(
        PopUpDetailState.popUp.id,
      );
      if (status === 200) {
        navigate('/dashboard/popup');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPopUpDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupId]);

  return (
    <PopUpDetailPresenter
      PopUpDetailState={PopUpDetailState}
      handleDeletePopUp={handleDeletePopUp}
      dispatch={dispatch}
    />
  );
};

export default PopUpDetailContainer;
