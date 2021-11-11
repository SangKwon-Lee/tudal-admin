import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP_Hidden_Reporter } from 'src/types/cp';
import { User } from 'src/types/user';
import CpReporterCreatePresenter from './CpReporterCreate.Presenter';
import { bucket_hiddenbox } from '../../common/conf/aws';
import { registerImage } from 'src/utils/registerImage';

export enum CpReporterCreateActionKind {
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  GET_REPORTER = 'GET_REPORTER',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
}

export interface CpReporterCreateAction {
  type: CpReporterCreateActionKind;
  payload?: any;
}

export interface CpReporterCreateState {
  loading: boolean;
  newCpReporter: CP_Hidden_Reporter;
  users: User[];
}

const initialState: CpReporterCreateState = {
  loading: false,
  newCpReporter: {
    nickname: '',
    intro: '',
    user: 0,
    imageUrl: '',
    tudalRecommendScore: 3,
    catchPhrase: '',
  },
  users: [],
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
    case CpReporterCreateActionKind.CHANGE_INPUT:
      return {
        ...state,
        newCpReporter: {
          ...state.newCpReporter,
          [payload.target.name]: payload.target.value,
        },
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
  const [cpCreateState, dispatch] = useReducer(
    CpReporterCreateReducer,
    initialState,
  );

  const getCpReporter = useCallback(async () => {
    dispatch({
      type: CpReporterCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APICp.getReporter(reporterId);
      let newData = {
        ...data,
        user: data.user.id,
      };
      console.log(newData);
      if (status === 200) {
        dispatch({
          type: CpReporterCreateActionKind.GET_REPORTER,
          payload: newData,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [reporterId]);
  const getUsers = useCallback(async () => {
    dispatch({
      type: CpReporterCreateActionKind.LOADING,
      payload: true,
    });

    try {
      const { data, status } = await APICp.getUsers();
      if (status === 200) {
        if (mode === 'edit') {
          dispatch({
            type: CpReporterCreateActionKind.GET_USERS,
            payload: data,
          });
        } else {
          dispatch({
            type: CpReporterCreateActionKind.GET_USERS,
            payload: data.filter((data) => !data.hidden_reporter),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [mode]);

  //* 리포터 등록
  const createCpReporter = async () => {
    const newInput = {
      ...cpCreateState.newCpReporter,
      // keyword: cpCreateState.newCpReporter.keyword.trim(),
      tudalRecommendScore: Number(
        cpCreateState.newCpReporter.tudalRecommendScore,
      ),
    };
    if (mode === 'create') {
      try {
        const { status } = await APICp.postReporter(newInput);
        if (status === 200) {
          toast.success('새로운 히든 리포터가 만들어졌습니다.');
        }
      } catch (error) {
        toast.error('오류가 발생했습니다.');
        console.log(error);
      }
    } else {
      try {
        console.log(newInput, '수정');
        const { status } = await APICp.putReporter(
          reporterId,
          newInput,
        );
        if (status === 200) {
          toast.success('히든 리포터가 수정됐습니다.');
        }
      } catch (error) {
        toast.error('오류가 발생했습니다.');
        console.log(error);
      }
    }
  };

  //* 이미지 등록
  const onChangeImgae = async (event) => {
    var file = event.target.files;
    dispatch({
      type: CpReporterCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const imageUrl = await registerImage(file, bucket_hiddenbox);
      dispatch({
        type: CpReporterCreateActionKind.CHANGE_IMAGE,
        payload: imageUrl,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };
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
      onChangeImgae={onChangeImgae}
      mode={mode}
      createCpReporter={createCpReporter}
    />
  );
};

export default CpReporterCreateContainer;
