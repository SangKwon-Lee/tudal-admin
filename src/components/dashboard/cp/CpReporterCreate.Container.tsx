import { useCallback, useEffect, useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP_Hidden_Reporter } from 'src/types/cp';
import { IUser } from 'src/types/user';
import CpReporterCreatePresenter from './CpReporterCreate.Presenter';
import { IBuckets } from '../../common/conf/aws';
import { registerImage } from 'src/utils/registerImage';
import useAuth from 'src/hooks/useAuth';

export enum CpReporterCreateActionKind {
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  GET_REPORTER = 'GET_REPORTER',
  GET_USER = 'GET_USER',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
  PRE_CROP_IMAGE = 'PRE_CROP_IMAGE',
  SAVE_CROP_IMAGE = 'SAVE_CROP_IMAGE',
}

export interface CpReporterCreateAction {
  type: CpReporterCreateActionKind;
  payload?: any;
}

export interface CpReporterCreateState {
  loading: boolean;
  newCpReporter: CP_Hidden_Reporter;
  newReporterUser: IUser;
  users: IUser[];
  cropImg: string;
  saveCropImg: string;
}

const initialState: CpReporterCreateState = {
  loading: false,
  newCpReporter: {
    nickname: '',
    intro: '',
    imageUrl: '',
    tudalRecommendScore: 3,
    catchphrase: '',
  },
  newReporterUser: null,
  users: [],
  cropImg: '',
  saveCropImg: '',
};

const CpReporterCreateReducer = (
  state: CpReporterCreateState,
  action: CpReporterCreateAction,
): CpReporterCreateState => {
  const { type, payload } = action;
  switch (type) {
    case CpReporterCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CpReporterCreateActionKind.GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case CpReporterCreateActionKind.CHANGE_IMAGE:
      return {
        ...state,
        newCpReporter: {
          ...state.newCpReporter,
          imageUrl: payload,
        },
        loading: false,
      };
    case CpReporterCreateActionKind.GET_REPORTER:
      return {
        ...state,
        newCpReporter: payload,
        loading: false,
      };
    case CpReporterCreateActionKind.GET_USER:
      return {
        ...state,
        newReporterUser: payload,
      };
    case CpReporterCreateActionKind.PRE_CROP_IMAGE:
      return {
        ...state,
        cropImg: payload,
      };
    case CpReporterCreateActionKind.SAVE_CROP_IMAGE:
      return {
        ...state,
        saveCropImg: payload,
      };
  }
};

interface ICpReporterCreateProps {
  mode?: string;
}
const CpReporterCreateContainer: React.FC<ICpReporterCreateProps> = (
  props,
) => {
  const mode = props.mode || 'create';
  const editorRef = useRef(null);
  const { userId, reporterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cpCreateState, dispatch] = useReducer(
    CpReporterCreateReducer,
    initialState,
  );

  const { newReporterUser } = cpCreateState;

  //* 기존 리포터 데이터 불러오기
  const getCpReporter = useCallback(async () => {
    dispatch({
      type: CpReporterCreateActionKind.LOADING,
      payload: true,
    });

    if (mode === 'selectAndCreate') {
      try {
        const { data } = await APICp.getUser(userId);
        dispatch({
          type: CpReporterCreateActionKind.GET_USER,
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data, status } = await APICp.getReporter(reporterId);
        let newData = {
          ...data,
          user: data.user.username,
        };

        if (status === 200) {
          dispatch({
            type: CpReporterCreateActionKind.GET_REPORTER,
            payload: newData,
          });
          dispatch({
            type: CpReporterCreateActionKind.GET_USER,
            payload: data.user,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reporterId, userId]);

  //* 유저 선택 불러오기
  const getUsers = useCallback(async () => {
    dispatch({
      type: CpReporterCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { data } = await APICp.getUsersNoReporter();
      dispatch({
        type: CpReporterCreateActionKind.GET_USERS,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // 리포터 소개글 (웹에디터)
  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };

  //* 리포터 등록
  const createCpReporter = async (data: CP_Hidden_Reporter) => {
    let reporter: CP_Hidden_Reporter = { ...data };

    const { cropImg, saveCropImg } = cpCreateState;
    if (cropImg && !saveCropImg) {
      toast.error('이미지를 크롭해주세요');
      return;
    }
    try {
      const imgUrl = await registerImage(
        cpCreateState.saveCropImg,
        IBuckets.CP_PHOTO,
      );

      reporter = {
        ...reporter,
        tudalRecommendScore: Number(data.tudalRecommendScore),
        user: newReporterUser.id,
        imageUrl: imgUrl,
        intro: log(),
      };

      if (mode === 'edit') {
        const { status } = await APICp.putReporter(
          reporterId,
          reporter,
        );
        if (status === 200) {
          toast.success('히든 리포터가 수정됐습니다.');
          navigate('/dashboard/cp');
        }
      } else {
        const { status } = await APICp.postReporter(reporter);
        if (status === 200) {
          toast.success('새로운 히든 리포터가 만들어졌습니다.');
          navigate('/dashboard/cp');
        }
      }
    } catch (error) {
      toast.error('오류가 발생했습니다.');
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId && !reporterId) {
      getUsers();
      return;
    }
    getCpReporter();
  }, [getCpReporter, getUsers, reporterId, userId]);

  return (
    <CpReporterCreatePresenter
      editorRef={editorRef}
      cpCreateState={cpCreateState}
      user={user}
      mode={mode}
      createCpReporter={createCpReporter}
      dispatch={dispatch}
    />
  );
};

export default CpReporterCreateContainer;
