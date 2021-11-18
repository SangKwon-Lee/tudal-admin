import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP_Hidden_Reporter } from 'src/types/cp';
import { IUser } from 'src/types/user';
import CpReporterCreatePresenter from './CpReporterCreate.Presenter';
import { bucket_hiddenbox } from '../../common/conf/aws';
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
  }, [reporterId]);

  //* 유저 선택 불러오기
  const getUsers = useCallback(async () => {
    dispatch({
      type: CpReporterCreateActionKind.LOADING,
      payload: true,
    });
    if (mode === 'edit') {
      try {
        const { data } = await APICp.getUsers();
        dispatch({
          type: CpReporterCreateActionKind.GET_USERS,
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await APICp.getUsersNoReporter();
        dispatch({
          type: CpReporterCreateActionKind.GET_USERS,
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [mode]);

  //* 리포터 등록
  const createCpReporter = async (data: CP_Hidden_Reporter) => {
    if (mode === 'create') {
      let newInput = {
        ...data,
        // keyword: cpCreateState.newCpReporter.keyword.trim(),
        tudalRecommendScore: Number(data.tudalRecommendScore),
      };
      try {
        const imgUrl = await registerImage(
          cpCreateState.saveCropImg,
          bucket_hiddenbox,
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
          bucket_hiddenbox,
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

  //* 이미지 등록
  // const onChangeImgae = async (event) => {
  //   var file = event.target.files;
  //   dispatch({
  //     type: CpReporterCreateActionKind.LOADING,
  //     payload: true,
  //   });
  //   try {
  //     const imageUrl = await registerImage(file, bucket_hiddenbox);
  //     dispatch({
  //       type: CpReporterCreateActionKind.CHANGE_IMAGE,
  //       payload: imageUrl,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

  useEffect(() => {
    getUsers();
    if (reporterId) {
      getCpReporter();
    }
  }, [getCpReporter, getUsers, reporterId]);
  return (
    <CpReporterCreatePresenter
      dispatch={dispatch}
      cpCreateState={cpCreateState}
      // onChangeImgae={onChangeImgae}
      mode={mode}
      createCpReporter={createCpReporter}
    />
  );
};

export default CpReporterCreateContainer;
