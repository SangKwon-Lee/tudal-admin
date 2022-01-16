import dayjs from 'dayjs';
import { FC, useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { APICp, APIHR, APIPopUp } from 'src/lib/api';
import PopUpCreatePresenter from './PopUpCreate.Presenter';
import { IBuckets } from 'src/components/common/conf/aws';
import { registerImage } from 'src/utils/registerImage';
import { IMaster } from 'src/types/master';
import { IHR } from 'src/types/hiddenreport';
import { CP_Hidden_Reporter } from 'src/types/cp';

export enum PopUpCreateActionKind {
  LOADING = 'LOADING',
  GET_ID = 'GET_ID',
  GET_POPUP = 'GET_POPUP',
  GET_POPUP_LENGTH = 'GET_POPUP_LENGTH',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_OPENTIME = 'CHANGE_OPENTIME',
  CHANGE_CLOSETIME = 'CHANGE_CLOSETIME',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
  CHANGE_SEARCH_WORD = 'CHANGE_SEARCH_WORD',
  CHANGE_CANDIDATES = 'CHANGE_CANDIDATES',
  CHANGE_TARGET = 'CHANGE_TARGET',
  CHANGE_TARGET_ID = 'CHANGE_TARGET_ID',
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
    openTime: string;
    closeTime: string;
    image: string;
    target: string;
    target_id: number;
  };
  popupLength: number;
  targetCandidate: {
    search: string;
    selected: any;
    master: Array<IMaster>;
    hidden_report: Array<IHR>;
    hidden_reporter: Array<CP_Hidden_Reporter>;
  };
}

export const POPUP_TARGET = [
  { key: 'premium', name: '프리미엄' },
  { key: 'master', name: '달인' },
  { key: 'hidden_report', name: '히든리포트' },
  { key: 'hidden_reporter', name: '히든리포터' },
];

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
    openTime: newOpenDate.format(),
    closeTime: newCloseDate.format(),
    image: '',
    target: POPUP_TARGET[0].key,
    target_id: null,
  },
  targetCandidate: {
    search: '',
    selected: {},
    master: [],
    hidden_reporter: [],
    hidden_report: [],
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
          openTime: payload.openTime,
          closeTime: payload.closeTime,
          image: payload.image,
          target: payload.target,
          target_id: payload.target_id,
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

    case PopUpCreateActionKind.CHANGE_TARGET:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          target: payload,
        },
        targetCandidate: {
          ...state.targetCandidate,
          hidden_reporter: [],
          master: [],
          hidden_report: [],
          search: '',
        },
      };
    case PopUpCreateActionKind.CHANGE_SEARCH_WORD:
      return {
        ...state,
        targetCandidate: {
          ...state.targetCandidate,
          search: payload,
        },
      };
    case PopUpCreateActionKind.CHANGE_CANDIDATES:
      return {
        ...state,
        targetCandidate: {
          ...state.targetCandidate,
          selected: payload.list[0],
          [payload.target]: payload.list,
        },
        createInput: {
          ...state.createInput,
          target_id: Number(payload.list[0].id),
        },
      };
    case PopUpCreateActionKind.CHANGE_TARGET_ID:
      return {
        ...state,
        targetCandidate: {
          ...state.targetCandidate,
          selected: payload,
        },
        createInput: {
          ...state.createInput,
          target_id: Number(payload.id),
        },
      };
  }
};

const PopUpCreateContainer: FC = () => {
  const navigate = useNavigate();
  const [PopUpCreateState, dispatch] = useReducer(
    PopUpCreateReducer,
    initialState,
  );

  const { target } = PopUpCreateState.createInput;
  const { search } = PopUpCreateState.targetCandidate;
  //* 기존 팝업 길이
  const getPopupLength = async () => {
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

  //* 팝업 생성 및 수정
  const createNewPopUp = async () => {
    if (!PopUpCreateState.createInput.image) {
      toast.error('이미지를 등록해주세요');
      return;
    }
    dispatch({ type: PopUpCreateActionKind.LOADING, payload: true });
    let newPopUp = {
      ...PopUpCreateState.createInput,
      order: PopUpCreateState.popupLength + 1,
    };

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

  const getTargetCandidate = useCallback(async () => {
    let list;

    let params = { _q: search };
    switch (target) {
      case 'master':
        list = await APICp.searchMasters(params);
        list = list.data.map((master) => {
          return {
            id: master.id,
            value: master.nickname,
            subValue: master.user?.username || '',
          };
        });
        break;

      case 'hidden_report':
        list = await APIHR.getList(params);
        list = list.data.map((report) => {
          return {
            id: report.id,
            value: report.title,
            subValue: report.hidden_reporter?.nickname || '',
          };
        });

        break;

      case 'hidden_reporter':
        list = await APICp.searchReporter(params);
        list = list.data.map((reporter) => {
          return {
            id: reporter.id,
            value: reporter.nickname,
            subValue: reporter.user?.username || '',
          };
        });

        break;
    }

    list?.length &&
      dispatch({
        type: PopUpCreateActionKind.CHANGE_CANDIDATES,
        payload: { target, list },
      });
  }, [target, search]);

  useEffect(() => {
    getPopupLength();
  }, []);

  useEffect(() => {
    getTargetCandidate();
  }, [getTargetCandidate]);

  return (
    <PopUpCreatePresenter
      dispatch={dispatch}
      PopUpCreateState={PopUpCreateState}
      createNewPopUp={createNewPopUp}
      onChangeImgae={onChangeImgae}
    />
  );
};

export default PopUpCreateContainer;
