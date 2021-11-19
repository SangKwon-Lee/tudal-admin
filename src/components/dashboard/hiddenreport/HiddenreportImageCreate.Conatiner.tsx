import { FC, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APIHR } from 'src/lib/api';
import { registerImage } from 'src/utils/registerImage';
import HiddenreportImageCreatePresenter from './HiddenreportImageCreate.Presenter';
import { useNavigate } from 'react-router-dom';
import { IBuckets } from 'src/components/common/conf/aws';

export enum HRImageCreateActionKind {
  LOADING = 'LOADING',
  GET_IMAGE = 'GET_IMAGE',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_OPENTIME = 'CHANGE_OPENTIME',
  CHANGE_CLOSETIME = 'CHANGE_CLOSETIME',
  CHANGE_THUMBNAIL_IMAGE = 'CHANGE_THUMBNAIL_IMAGE',
  CHANGE_SQUARE_IMAGE = 'CHANGE_SQUARE_IMAGE',
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
    squareImageUrl: string;
  };
}

const initialState: HRImageCreateState = {
  loading: false,
  createInput: {
    name: '',
    keyword: '',
    thumbnailImageUrl: '',
    squareImageUrl: '',
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

    case HRImageCreateActionKind.CHANGE_THUMBNAIL_IMAGE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          thumbnailImageUrl: payload,
        },
      };
    case HRImageCreateActionKind.CHANGE_SQUARE_IMAGE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          squareImageUrl: payload,
        },
      };
    case HRImageCreateActionKind.GET_IMAGE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          name: payload.name,
          keyword: payload.keyword,
          thumbnailImageUrl: payload.thumbnailImageUrl,
          squareImageUrl: payload.squareImageUrl,
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
  const navigate = useNavigate();

  const [HRImageCreateState, dispatch] = useReducer(
    PopUpCreateReducer,
    initialState,
  );

  //* 새로운 이미지 생성
  const createNewHRimage = async () => {
    try {
      dispatch({
        type: HRImageCreateActionKind.LOADING,
        payload: true,
      });
      const newImage = {
        ...HRImageCreateState.createInput,
      };
      if (mode === 'edit') {
        const { status } = await APIHR.editImage(id, newImage);
        if (status === 200) {
          toast.success('이미지가 수정되었습니다.');
          navigate('/dashboard/hiddenreports/images');
        }
      } else {
        const { status } = await APIHR.createImage(newImage);
        if (status === 200) {
          toast.success('이미지가 생성되었습니다.');
          navigate('/dashboard/hiddenreports/images');
        }
      }
    } catch (error) {
      toast.error('오류가 생겼습니다.');
      console.log(error);
    } finally {
      dispatch({
        type: HRImageCreateActionKind.LOADING,
        payload: false,
      });
    }
  };

  //* 이미지 등록
  const onChangeImage = async (event, type) => {
    var file = event.target.files;
    dispatch({
      type: HRImageCreateActionKind.LOADING,
      payload: true,
    });
    try {
      // Koscom Cloud에 업로드하기!
      const imageUrl = await registerImage(
        file,
        IBuckets.HIDDENREPORT_IMAGE,
      );

      dispatch({
        type,
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

  const getImage = async () => {
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
        console.log(data);
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
      getImage();
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
