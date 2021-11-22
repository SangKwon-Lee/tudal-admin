import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP_Hidden_Reporter } from 'src/types/cp';
import { IUser } from 'src/types/user';
import CpReporterCreatePresenter from './CpReporterCreate.Presenter';
import { IBuckets } from '../../common/conf/aws';
import { registerImage } from 'src/utils/registerImage';

export enum CpReporterCreateActionKind {
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  GET_REPORTER = 'GET_REPORTER',
  GET_USER_ID = 'GET_USER_ID',
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
  users: IUser[];
  userId: number;
  cropImg: string;
  saveCropImg: string;
}

const initialState: CpReporterCreateState = {
  loading: false,
  newCpReporter: {
    nickname: '',
    intro: '',
    user: 1,
    imageUrl: '',
    tudalRecommendScore: 3,
    catchphrase: '',
  },
  users: [],
  userId: 0,
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
    case CpReporterCreateActionKind.GET_USER_ID:
      return {
        ...state,
        userId: payload,
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
  const { reporterId } = useParams();
  const mode = props.mode || 'create';
  const navigate = useNavigate();
  const [cpCreateState, dispatch] = useReducer(
    CpReporterCreateReducer,
    initialState,
  );

  //* 기존 리포터 데이터 불러오기
  const getCpReporter = useCallback(async () => {
    dispatch({
      type: CpReporterCreateActionKind.LOADING,
      payload: true,
    });
    if (mode === 'create' && reporterId) {
      try {
        const { data } = await APICp.getUser(reporterId);
        let newData = {
          ...cpCreateState.newCpReporter,
          user: data.username,
          id: data.id,
        };
        dispatch({
          type: CpReporterCreateActionKind.GET_REPORTER,
          payload: newData,
        });
        dispatch({
          type: CpReporterCreateActionKind.GET_USER_ID,
          payload: reporterId,
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
            type: CpReporterCreateActionKind.GET_USER_ID,
            payload: data.user.id,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reporterId]);

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

  //* 리포터 등록
  const createCpReporter = async (data: CP_Hidden_Reporter) => {
    let newInput = {
      ...data,
    };
    if (mode === 'create') {
      if (cpCreateState.userId) {
        newInput = {
          ...newInput,
          tudalRecommendScore: Number(data.tudalRecommendScore),
          user: cpCreateState.userId,
        };
      } else {
        newInput = {
          ...newInput,
          tudalRecommendScore: Number(data.tudalRecommendScore),
        };
      }
      try {
        const imgUrl = await registerImage(
          cpCreateState.saveCropImg,
          IBuckets.CP_PHOTO,
        );
        newInput = {
          ...newInput,
          imageUrl: imgUrl,
        };
        const { status } = await APICp.postReporter(newInput);
        if (status === 200) {
          toast.success('새로운 히든 리포터가 만들어졌습니다.');
          navigate('/dashboard/cp');
        }
      } catch (error) {
        toast.error('오류가 발생했습니다.');
        console.log(error);
      }
    } else {
      try {
        const imgUrl = await registerImage(
          cpCreateState.saveCropImg,
          IBuckets.CP_PHOTO,
        );
        const newInput = {
          ...data,
          tudalRecommendScore: Number(data.tudalRecommendScore),
          imageUrl: imgUrl,
          user: cpCreateState.userId,
        };
        const { status } = await APICp.putReporter(
          reporterId,
          newInput,
        );
        if (status === 200) {
          toast.success('히든 리포터가 수정됐습니다.');
          navigate('/dashboard/cp');
        }
      } catch (error) {
        toast.error('오류가 발생했습니다.');
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!reporterId) {
      getUsers();
    }
    if (reporterId) {
      getCpReporter();
    }
  }, [getCpReporter, getUsers, reporterId]);

  return (
    <CpReporterCreatePresenter
      dispatch={dispatch}
      cpCreateState={cpCreateState}
      mode={mode}
      createCpReporter={createCpReporter}
    />
  );
};

export default CpReporterCreateContainer;
