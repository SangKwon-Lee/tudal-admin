import { FC, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APIHR } from 'src/lib/api';
import { registerImage } from 'src/utils/registerImage';
import HiddenreportImageCreatePresenter from './HiddenreportImageCreate.Presenter';
import { useNavigate } from 'react-router-dom';
import { IBuckets } from 'src/components/common/conf/aws';
import { IHRNewImage } from 'src/types/hiddenreport';

export enum HRImageCreateActionKind {
  LOADING = 'LOADING',
  GET_IMAGE = 'GET_IMAGE',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_OPENTIME = 'CHANGE_OPENTIME',
  CHANGE_CLOSETIME = 'CHANGE_CLOSETIME',
  CHANGE_THUMBNAIL_IMAGE = 'CHANGE_THUMBNAIL_IMAGE',
  CHANGE_LIST = 'CHANGE_LIST',
  CHANGE_SQUARE_IMAGE = 'CHANGE_SQUARE_IMAGE',
  ADD = 'ADD',
  REMOVE = 'REMOVE',
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
  imageList: IHRNewImage[];
  index: number;
}

const initialState: HRImageCreateState = {
  loading: false,
  createInput: {
    name: '',
    keyword: '',
    thumbnailImageUrl: '',
    squareImageUrl: '',
  },
  imageList: [
    {
      name: '',
      keyword: '',
      thumbnailImageUrl: '',
      squareImageUrl: '',
    },
  ],
  index: 0,
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
    case HRImageCreateActionKind.CHANGE_LIST:
      return {
        ...state,
        imageList: payload,
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
    case HRImageCreateActionKind.ADD:
      return {
        ...state,
        imageList: payload,
      };
    case HRImageCreateActionKind.REMOVE:
      return {
        ...state,
        imageList: payload,
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
  console.log(mode);
  //* 새로운 이미지 생성
  // * 7.22 생성 모드일 때에는 forEach로 createInput에 있는 각 객체마다 createImage 실행
  const createNewHRimage = async () => {
    try {
      dispatch({
        type: HRImageCreateActionKind.LOADING,
        payload: true,
      });
      if (mode === 'edit') {
        const newImage = { ...HRImageCreateState.createInput };
        const { status } = await APIHR.editImage(id, newImage);
        if (status === 200) {
          toast.success('이미지가 수정되었습니다.');
          navigate('/dashboard/hiddenreports/images');
        }
      } else {
        await Promise.all(
          HRImageCreateState.imageList.map(async (item) => {
            return await APIHR.createImage(item);
          }),
        );
        toast.success('이미지가 업로드 되었습니다.');
      }
    } catch (error) {
      toast.error('오류가 생겼습니다.');
      console.log(error);
    } finally {
      dispatch({
        type: HRImageCreateActionKind.LOADING,
        payload: false,
      });
      navigate('/dashboard/hiddenreports/images');
    }
  };

  //* 이미지 등록
  const onChangeImage = async (event, type) => {
    var files = event.target.files;
    dispatch({
      type: HRImageCreateActionKind.LOADING,
      payload: true,
    });
    try {
      // Koscom Cloud에 업로드하기!
      const imageUrl = await registerImage(
        files,
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

  const onChangeImageList = async (event, type, index) => {
    let newData = [...HRImageCreateState.imageList];
    console.log(newData);
    var files = event.target.files;

    if (files) {
      try {
        const imageUrl = await registerImage(
          files,
          IBuckets.HIDDENREPORT_IMAGE,
        );
        newData[index] = {
          ...newData[index],
          [event.target.name]: imageUrl,
        };
      } catch (e) {
        console.log(e);
      }
    } else {
      newData[index] = {
        ...newData[index],
        [event.target.name]: event.target.value,
      };
    }
    dispatch({
      type,
      payload: newData,
    });
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

  const addComponent = () => {
    let Compo = [...HRImageCreateState.imageList];
    Compo.push({
      name: '',
      keyword: '',
      thumbnailImageUrl: '',
      squareImageUrl: '',
    });
    dispatch({
      type: HRImageCreateActionKind.ADD,
      payload: Compo,
    });
  };

  const removeComponent = () => {
    let Compo = [...HRImageCreateState.imageList];
    Compo.pop();
    dispatch({
      type: HRImageCreateActionKind.REMOVE,
      payload: Compo,
    });
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
      onChangeImageList={onChangeImageList}
      mode={mode}
      addComponent={addComponent}
      removeComponent={removeComponent}
    />
  );
};

export default HiddenreportCreateContainer;
