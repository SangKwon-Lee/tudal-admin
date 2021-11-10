import dayjs from 'dayjs';
import { FC, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APIHR, APIPopUp } from 'src/lib/api';
import HiddenreportImageCreatePresenter from './HiddenreportImageCreate.Presenter';
const AWS = require('aws-sdk');
const region = 'ap-northeast-2';

const S3 = new AWS.S3({
  region,
  credentials: {
    accessKeyId: process.env.ACCESS_KET,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

const bucket_name = 'tudal-popup-photo';

export enum HRImageCreateActionKind {
  LOADING = 'LOADING',
  GET_IMAGE = 'GET_IMAGE',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_OPENTIME = 'CHANGE_OPENTIME',
  CHANGE_CLOSETIME = 'CHANGE_CLOSETIME',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
}

export interface HRImageCreateAction {
  type: HRImageCreateActionKind;
  payload?: any;
}

export interface HRImageCreateState {
  loading: boolean;
  createInput: {
    name: string;
    keyword: string;
    thumbnailImageUrl: string;
  };
}

const initialState: HRImageCreateState = {
  loading: false,
  createInput: {
    name: '',
    keyword: '',
    thumbnailImageUrl: '',
  },
};

const PopUpCreateReducer = (
  state: HRImageCreateState,
  action: HRImageCreateAction,
): HRImageCreateState => {
  const { type, payload } = action;
  switch (type) {
    case HRImageCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case HRImageCreateActionKind.CHANGE_INPUT:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          [payload.target.name]: payload.target.value,
        },
      };

    case HRImageCreateActionKind.CHANGE_IMAGE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          thumbnailImageUrl: payload,
        },
      };
    case HRImageCreateActionKind.GET_IMAGE:
      console.log('1231', payload);
      return {
        ...state,
        createInput: {
          ...state.createInput,
          name: payload.name,
          keyword: payload.keyword,
          thumbnailImageUrl: payload.thumbnailImageUrl,
        },
      };
  }
};

interface HRimageCreateProps {
  mode?: string;
  pageTopRef: React.RefObject<HTMLDivElement>;
}

const HiddenreportCreateContainer: FC<HRimageCreateProps> = (
  props,
) => {
  const mode = props.mode || 'create';
  const { id } = useParams();
  console.log(id, mode);

  const [HRImageCreateState, dispatch] = useReducer(
    PopUpCreateReducer,
    initialState,
  );

  //* 새로운 팝업 생성
  const createNewHRimage = async () => {
    try {
      dispatch({
        type: HRImageCreateActionKind.LOADING,
        payload: true,
      });
      const newImage = {
        ...HRImageCreateState.createInput,
      };
      const { status } = await APIHR.createImage(newImage);
      if (status === 200) {
        toast.success('이미지가 생성되었습니다.');
        dispatch({
          type: HRImageCreateActionKind.LOADING,
          payload: false,
        });
      }
    } catch (error) {
      toast.error('오류가 생겼습니다.');
      console.log(error);
    }
  };

  //* 이미지 등록
  const onChangeImage = async (event) => {
    var file = event.target.files;
    dispatch({
      type: HRImageCreateActionKind.LOADING,
      payload: true,
    });
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
        type: HRImageCreateActionKind.CHANGE_IMAGE,
        payload: imageUrl,
      });
      dispatch({
        type: HRImageCreateActionKind.LOADING,
        payload: false,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getPopUp = async () => {
    dispatch({
      type: HRImageCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APIHR.getImage(id);
      if (status === 200) {
        dispatch({
          type: HRImageCreateActionKind.GET_IMAGE,
          payload: data,
        });
        dispatch({
          type: HRImageCreateActionKind.LOADING,
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

  return (
    <HiddenreportImageCreatePresenter
      HRImageCreateState={HRImageCreateState}
      dispatch={dispatch}
      createNewHRimage={createNewHRimage}
      onChangeImage={onChangeImage}
      mode={mode}
    />
  );
};

export default HiddenreportCreateContainer;
