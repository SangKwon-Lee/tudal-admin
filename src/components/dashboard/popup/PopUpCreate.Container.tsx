import dayjs from 'dayjs';
import { FC, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APIPopUp } from 'src/lib/api';
import PopUpCreatePresenter from './PopUpCreate.Presenter';

const AWS = require('aws-sdk');
const region = 'ap-northeast-2';
const access_key = 'AKIAY53UECMD2OMWX4UR';
const secret_key = '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';

const S3 = new AWS.S3({
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});

const bucket_name = 'hiddenbox-photo';

export enum PopUpCreateActionKind {
  LOADING = 'LOADING',
  GET_POPUP = 'GET_POPUP',
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
  };
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
  createInput: {
    title: '',
    description: '',
    order: null,
    isOpen: false,
    openTime: newOpenDate.format(),
    closeTime: newCloseDate.format(),
    link: '',
    linkDescription: '',
    image: '',
  },
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
        },
      };
  }
};

interface PopUpCreateProps {
  mode?: string;
}

const PopUpCreateContainer: FC<PopUpCreateProps> = (props) => {
  const mode = props.mode || 'create';
  const { popupId } = useParams();

  const [PopUpCreateState, dispatch] = useReducer(
    PopUpCreateReducer,
    initialState,
  );

  //* 새로운 팝업 생성
  const createNewPopUp = async () => {
    dispatch({ type: PopUpCreateActionKind.LOADING, payload: true });
    try {
      const newPopUp = {
        ...PopUpCreateState.createInput,
      };
      const { status } = await APIPopUp.createPopUp(newPopUp);
      if (status === 200) {
        toast.success('팝업이 생성됐습니다.');
        dispatch({
          type: PopUpCreateActionKind.LOADING,
          payload: false,
        });
      }
    } catch (error) {
      toast.error('오류가 생겼습니다.');
      console.log(error);
    }
  };

  //* 이미지 등록
  const onChangeImgae = async (event) => {
    var file = event.target.files;
    try {
      // Koscom Cloud에 업로드하기!
      await S3.putObject({
        Bucket: bucket_name,
        Key: file[0].name,
        ACL: 'public-read',
        // ACL을 지우면 전체공개가 되지 않습니다.
        Body: file[0],
      }).promise();
      const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${file[0].name}`;
      dispatch({
        type: PopUpCreateActionKind.CHANGE_IMAGE,
        payload: imageUrl,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(PopUpCreateState.createInput);
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
