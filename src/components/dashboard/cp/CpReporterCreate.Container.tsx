import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP } from 'src/types/cp';
import { User } from 'src/types/user';
import CpReporterCreatePresenter from './CpReporterCreate.Presenter';
const AWS = require('aws-sdk');
const region = 'ap-northeast-2';
const access_key = 'AKIAY53UECMD2OMWX4UR';
const secret_key = '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';

//* 환경변수에 관한 오류 노션 확인
const S3 = new AWS.S3({
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});

//* cpProfile-photo 등의 이름으로 버킷 생성 필요
const bucket_name = 'hiddenbox-photo';

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
  newCpReporter: CP;
  users: User[];
}

const initialState: CpReporterCreateState = {
  loading: false,
  newCpReporter: {
    nickname: '',
    intro: '',
    keyword: '',
    user: 0,
    profile_image_url: '',
    tudalRecommendScore: '',
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
          profile_image_url: payload,
        },
      };
    case CpReporterCreateActionKind.GET_REPORTER:
      return {
        ...state,
        newCpReporter: payload,
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
      const { data, status } = await APICp.getMaster(reporterId);
      if (status === 200) {
        dispatch({
          type: CpReporterCreateActionKind.GET_REPORTER,
          payload: data,
        });
      }
      dispatch({
        type: CpReporterCreateActionKind.LOADING,
        payload: false,
      });
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
        dispatch({
          type: CpReporterCreateActionKind.GET_USERS,
          payload: data,
        });
        dispatch({
          type: CpReporterCreateActionKind.LOADING,
          payload: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  //* 리포터 등록
  const createCpReporter = async () => {
    const newInput = {
      ...cpCreateState.newCpReporter,
      keyword: cpCreateState.newCpReporter.keyword.trim(),
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
      // Koscom Cloud에 업로드하기!
      await S3.putObject({
        Bucket: bucket_name,
        Key: file[0].name,
        ACL: 'public-read',
        // ACL을 지우면 전체공개가 되지 않습니다.
        Body: file[0],
      }).promise();
      //* 버킷이름으로 파일이 만들어지기 때문에 추후 버킷 폴더 만들고 난 뒤 변경 필요
      const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${file[0].name}`;
      dispatch({
        type: CpReporterCreateActionKind.CHANGE_IMAGE,
        payload: imageUrl,
      });
      dispatch({
        type: CpReporterCreateActionKind.LOADING,
        payload: false,
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
