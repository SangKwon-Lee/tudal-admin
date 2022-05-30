import { useEffect, useReducer } from 'react';
import { ISideBanner } from 'src/types/sidebanner';
import SideBannerCreatePresenter from './SideBannerCreate.Presenter';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { APISideBanner } from 'src/lib/api';
import { registerImage } from 'src/utils/registerImage';
import { IBuckets } from 'src/components/common/conf/aws';

interface SideBannerCreateProps {
  mode: string;
  bannerId?: number | string;
  pageTopRef?: any;
}

export enum SideBannerCreateActionKind {
  LOADING = 'LOADING',
  GET_SIDE_BANNER = 'GET_SIDE_BANNER',
  CHANGE_SMALL_IMAGE = 'CHANGE_SMALL_IMAGE',
  CHANGE_BIG_IMAGE = 'CHANGE_BIG_IMAGE',
  CHANGE_SIGNUP_IMAGE = 'CHANGE_SIGNUP_IMAGE',
}

export interface SideBannerCreateAction {
  type: SideBannerCreateActionKind;
  payload?: any;
}

export interface SideBannerCreateState {
  loading: boolean;
  newSideBanner: ISideBanner;
}

const initialState: SideBannerCreateState = {
  loading: false,
  newSideBanner: {
    id: 0,
    title: '',
    url: '',
    bigImgUrl: '',
    signupImgUrl: '',
    smallImgUrl: '',
  },
};

const SideBannerCreateReducer = (
  state: SideBannerCreateState,
  action: SideBannerCreateAction,
): SideBannerCreateState => {
  const { type, payload } = action;
  switch (type) {
    case SideBannerCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case SideBannerCreateActionKind.GET_SIDE_BANNER:
      return {
        ...state,
        newSideBanner: payload,
      };
    case SideBannerCreateActionKind.CHANGE_BIG_IMAGE:
      return {
        ...state,
        newSideBanner: {
          ...state.newSideBanner,
          bigImgUrl: payload,
        },
      };
    case SideBannerCreateActionKind.CHANGE_SMALL_IMAGE:
      return {
        ...state,
        newSideBanner: {
          ...state.newSideBanner,
          smallImgUrl: payload,
        },
      };
    case SideBannerCreateActionKind.CHANGE_SIGNUP_IMAGE:
      return {
        ...state,
        newSideBanner: {
          ...state.newSideBanner,
          signupImgUrl: payload,
        },
      };
  }
};

const SideBannerCreateContainer: React.FC<SideBannerCreateProps> = ({
  mode,
  pageTopRef,
  bannerId,
}) => {
  const [sideBannerCreateState, dispatch] = useReducer(
    SideBannerCreateReducer,
    initialState,
  );
  const navigate = useNavigate();

  // * 새로운 배너 생성
  const sideBannerCreate = async (data: ISideBanner) => {
    const newSideBanner: ISideBanner = {
      title: data.title,
      url: data.url,
      bigImgUrl: sideBannerCreateState.newSideBanner.bigImgUrl,
      signupImgUrl: sideBannerCreateState.newSideBanner.signupImgUrl,
      smallImgUrl: sideBannerCreateState.newSideBanner.smallImgUrl,
    };
    try {
      if (mode === 'create') {
        const { data } = await APISideBanner.createSideBanner(
          newSideBanner,
        );
        console.log(data);
        toast.success('사이드 배너가 수정됐습니다.');
        navigate(`/dashboard/sidebanner/list`);
      } else {
        const { data } = await APISideBanner.putSideBanner(
          newSideBanner,
          bannerId,
        );
        console.log(data);
        toast.success('사이드 배너가 수정됐습니다.');
        navigate(`/dashboard/sidebanner/list`);
      }
    } catch (e) {
      console.log(e);
      navigate(`/dashboard/sidebanner/list`);
      toast.error('오류가 생겼습니다.');
    }
  };

  //* 이미지 등록
  const onChangeImage = async (event, type) => {
    var file = event.target.files;
    dispatch({
      type: SideBannerCreateActionKind.LOADING,
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
        type: SideBannerCreateActionKind.LOADING,
        payload: false,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // * 수정시 데이터 가져오기
  const getSideBanner = async () => {
    try {
      const { data, status } = await APISideBanner.getSideBanner(
        bannerId,
      );
      if (status === 200) {
        dispatch({
          type: SideBannerCreateActionKind.GET_SIDE_BANNER,
          payload: data,
        });
        console.log(data);
      }
    } catch (e) {
      console.log(e);
      toast.error('오류가 생겼습니다.');
    }
  };

  useEffect(() => {
    if (mode === 'edit') {
      getSideBanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SideBannerCreatePresenter
      mode={mode}
      dispatch={dispatch}
      onChangeImage={onChangeImage}
      sideBannerCreate={sideBannerCreate}
      sideBannerCreateState={sideBannerCreateState}
    />
  );
};

export default SideBannerCreateContainer;
