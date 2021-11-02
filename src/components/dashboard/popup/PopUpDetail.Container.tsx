import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { APIPopUp } from 'src/lib/api';
import { IPopUp } from 'src/types/popup';
import PopUpDetailPresenter from './PopUpDetail.Presenter';

export enum PopUpDetailActionKind {
  LOADING = 'LOADING',
  GET_POPUP = 'GET_POPUP',
}

export interface PopUpDetailAction {
  type: PopUpDetailActionKind;
  payload?: any;
}

export interface PopUpDetailState {
  loading: boolean;
  popUp: IPopUp;
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
  },
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
  }
};

const PopUpDetailContainer = () => {
  const [PopUpDetailState, dispatch] = useReducer(
    PopUpDetailReducer,
    initialState,
  );
  const { popupId } = useParams();

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

  useEffect(() => {
    getPopUpDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupId]);

  return <PopUpDetailPresenter PopUpDetailState={PopUpDetailState} />;
};

export default PopUpDetailContainer;
