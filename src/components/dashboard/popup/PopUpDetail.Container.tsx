import { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APIPopUp } from 'src/lib/api';
import { IPopUp } from 'src/types/popup';
import PopUpDetailPresenter from './PopUpDetail.Presenter';

export enum PopUpDetailActionKind {
  LOADING = 'LOADING',
  GET_POPUP = 'GET_POPUP',
  MODAL_OPEN = 'MODAL_OPEN',
  MODAL_CLOSE = 'MODAL_CLOSE',
}

export interface PopUpDetailAction {
  type: PopUpDetailActionKind;
  payload?: any;
}

export interface PopUpDetailState {
  loading: boolean;
  popUp: IPopUp;
  openModal: boolean;
}

const initialState: PopUpDetailState = {
  loading: false,
  popUp: {
    id: 0,
    title: '',
    description: '',
    order: null,
    isOpen: false,
    openTime: '',
    closeTime: '',
    link: '',
    linkDescription: '',
    image: '',
    type: '',
  },
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
  }
};

const PopUpDetailContainer = () => {
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
        dispatch({
          type: PopUpDetailActionKind.LOADING,
          payload: false,
        });
      }
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
