import dayjs from 'dayjs';
import { FC, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { APIPopUp } from 'src/lib/api';
import PopUpCreatePresenter from './PopUpCreate.Presenter';
import { IBuckets } from 'src/components/common/conf/aws';
import { registerImage } from 'src/utils/registerImage';
import { isUseDay } from 'src/utils/isUseDay';

export enum PopUpCreateActionKind {
  LOADING = 'LOADING',
  GET_ID = 'GET_ID',
  GET_POPUP = 'GET_POPUP',
  GET_POPUP_LENGTH = 'GET_POPUP_LENGTH',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_OPENTIME = 'CHANGE_OPENTIME',
  CHANGE_CLOSETIME = 'CHANGE_CLOSETIME',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
}

export interface PopUpCreateAction {
  type: PopUpCreateActionKind;
  payload?: any;
}

export interface PopUpCreateState {
  loading: boolean;
  id: number;
  createInput: {
    title: string;
    description: string;
    order: number;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    link: string;
    linkDescription: string;
    image: string;
    type: string;
  };
  popupLength: number;
}

let newOpenDate = dayjs();
newOpenDate = newOpenDate.add(1, 'date');
newOpenDate = newOpenDate.set('hour', 0);
newOpenDate = newOpenDate.set('minute', 0);

let newCloseDate = dayjs();
newCloseDate = newCloseDate.add(1, 'date');
newCloseDate = newCloseDate.set('hour', 23);
newCloseDate = newCloseDate.set('minute', 59);

const initialState: PopUpCreateState = {
  loading: false,
  id: 0,
  createInput: {
    title: '',
    description: '',
    order: null,
    isOpen: isUseDay(newCloseDate.format()),
    openTime: newOpenDate.format(),
    closeTime: newCloseDate.format(),
    link: '',
    linkDescription: '',
    image: '',
    type: 'premium',
  },
  popupLength: 0,
};

const PopUpCreateReducer = (
  state: PopUpCreateState,
  action: PopUpCreateAction,
): PopUpCreateState => {
  const { type, payload } = action;
  switch (type) {
    case PopUpCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case PopUpCreateActionKind.CHANGE_INPUT:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          [payload.target.name]: payload.target.value,
        },
      };
    case PopUpCreateActionKind.CHANGE_OPENTIME:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          openTime: payload,
        },
      };
    case PopUpCreateActionKind.CHANGE_CLOSETIME:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          closeTime: payload,
        },
      };
    case PopUpCreateActionKind.CHANGE_IMAGE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          image: payload,
        },
      };
    case PopUpCreateActionKind.GET_POPUP:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          title: payload.title,
          description: payload.description,
          order: payload.order,
          isOpen: payload.isOpen,
          openTime: payload.openTime,
          closeTime: payload.closeTime,
          link: payload.link,
          linkDescription: payload.linkDescription,
          image: payload.image,
          type: payload.type,
        },
      };
    case PopUpCreateActionKind.GET_POPUP_LENGTH:
      return {
        ...state,
        popupLength: payload,
      };
    case PopUpCreateActionKind.GET_ID:
      return {
        ...state,
        id: payload,
      };
  }
};

interface PopUpCreateProps {
  mode?: string;
}

const PopUpCreateContainer: FC<PopUpCreateProps> = (props) => {
  const mode = props.mode || 'create';
  const { popupId } = useParams();
  const navigate = useNavigate();
  const [PopUpCreateState, dispatch] = useReducer(
    PopUpCreateReducer,
    initialState,
  );

  //* 기존 팝업 길이
  const getPopupLength = async () => {
    dispatch({ type: PopUpCreateActionKind.LOADING, payload: true });
    try {
      const { data } = await APIPopUp.getCount();
      dispatch({
        type: PopUpCreateActionKind.GET_POPUP_LENGTH,
        payload: data,
      });
    } catch (e) {
      console.log(e);
    }
  };
  console.log(isUseDay(PopUpCreateState.createInput.closeTime));
  //* 팝업 생성 및 수정
  const createNewPopUp = async () => {
    dispatch({ type: PopUpCreateActionKind.LOADING, payload: true });

    let newPopUp = {
      ...PopUpCreateState.createInput,
    };
    if (mode !== 'edit') {
      //* 공개 시간이면 자동으로 order 설정
      if (isUseDay(PopUpCreateState.createInput.closeTime)) {
        newPopUp = {
          ...newPopUp,
          order: PopUpCreateState.popupLength + 1,
          isOpen: true,
        };
      }
      try {
        const { status } = await APIPopUp.createPopUp(newPopUp);
        if (status === 200) {
          toast.success('팝업이 생성됐습니다.');
          dispatch({
            type: PopUpCreateActionKind.LOADING,
            payload: false,
          });
          navigate(`/dashboard/popup`);
        }
      } catch (error) {
        toast.error('오류가 생겼습니다.');
        console.log(error);
      }
    } else {
      if (isUseDay(PopUpCreateState.createInput.closeTime)) {
        newPopUp = {
          ...newPopUp,
          isOpen: true,
        };
      } else {
        newPopUp = {
          ...newPopUp,
          order: null,
          isOpen: false,
        };
      }
      try {
        const { status } = await APIPopUp.editPopup(
          PopUpCreateState.id,
          newPopUp,
        );
        if (status === 200) {
          toast.success('팝업이 수정됐습니다.');
          dispatch({
            type: PopUpCreateActionKind.LOADING,
            payload: false,
          });
        }
        navigate(`/dashboard/popup`);
      } catch (error) {
        toast.error('오류가 생겼습니다.');
        console.log(error);
      }
    }
  };

  //* 이미지 등록
  const onChangeImgae = async (event) => {
    var file = event.target.files;
    dispatch({ type: PopUpCreateActionKind.LOADING, payload: true });
    try {
      // Koscom Cloud에 업로드하기!
      const imageUrl = await registerImage(
        file,
        IBuckets.HIDDENREPORT_IMAGE,
      );
      dispatch({
        type: PopUpCreateActionKind.CHANGE_IMAGE,
        payload: imageUrl,
      });
      dispatch({
        type: PopUpCreateActionKind.LOADING,
        payload: false,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getPopUp = async () => {
    dispatch({ type: PopUpCreateActionKind.LOADING, payload: true });
    try {
      const { data, status } = await APIPopUp.getPopUp(popupId);
      if (status === 200) {
        dispatch({
          type: PopUpCreateActionKind.GET_POPUP,
          payload: data,
        });
        dispatch({
          type: PopUpCreateActionKind.GET_ID,
          payload: data.id,
        });
        dispatch({
          type: PopUpCreateActionKind.LOADING,
          payload: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mode === 'edit') {
      getPopUp();
    }
    getPopupLength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PopUpCreatePresenter
      dispatch={dispatch}
      PopUpCreateState={PopUpCreateState}
      createNewPopUp={createNewPopUp}
      onChangeImgae={onChangeImgae}
      mode={mode}
    />
  );
};

export default PopUpCreateContainer;
