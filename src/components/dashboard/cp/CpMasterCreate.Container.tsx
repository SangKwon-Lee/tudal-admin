import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP } from 'src/types/cp';
import { User } from 'src/types/user';
import CpMasterCreatePresenter from './CpMasterCreate.Presenter';
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

export enum CpMasterCreateActionKind {
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  GET_MASTER = 'GET_MASTER',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
}

export interface CpMasterCreateAction {
  type: CpMasterCreateActionKind;
  payload?: any;
}

export interface CpMasterCreateState {
  loading: boolean;
  newCpMaster: CP;
  users: User[];
}

const initialState: CpMasterCreateState = {
  loading: false,
  newCpMaster: {
    nickname: '',
    intro: '',
    keyword: '',
    user: 0,
    profile_image_url: '',
  },
  users: [],
};

const CpMasterCreateReducer = (
  state: CpMasterCreateState,
  action: CpMasterCreateAction,
): CpMasterCreateState => {
  const { type, payload } = action;
  switch (type) {
    case CpMasterCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CpMasterCreateActionKind.GET_USERS:
      return {
        ...state,
        users: payload,
      };
    case CpMasterCreateActionKind.CHANGE_INPUT:
      return {
        ...state,
        newCpMaster: {
          ...state.newCpMaster,
          [payload.target.name]: payload.target.value,
        },
      };
    case CpMasterCreateActionKind.CHANGE_IMAGE:
      return {
        ...state,
        newCpMaster: {
          ...state.newCpMaster,
          profile_image_url: payload,
        },
      };
    case CpMasterCreateActionKind.GET_MASTER:
      return {
        ...state,
        newCpMaster: payload,
      };
  }
};

interface ICpMasterCreateProps {
  mode?: string;
}
const CpMasterCreateContainer: React.FC<ICpMasterCreateProps> = (
  props,
) => {
  const { masterId } = useParams();
  const mode = props.mode || 'create';
  const [cpCreateState, dispatch] = useReducer(
    CpMasterCreateReducer,
    initialState,
  );

  const getCpMaster = useCallback(async () => {
    dispatch({
      type: CpMasterCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APICp.getMaster(masterId);
      if (status === 200) {
        dispatch({
          type: CpMasterCreateActionKind.GET_MASTER,
          payload: data,
        });
      }
      dispatch({
        type: CpMasterCreateActionKind.LOADING,
        payload: false,
      });
    } catch (error) {
      console.log(error);
    }
  }, [masterId]);

  const getUsers = useCallback(async () => {
    dispatch({
      type: CpMasterCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APICp.getUsers();
      if (status === 200) {
        dispatch({
          type: CpMasterCreateActionKind.GET_USERS,
          payload: data,
        });
        dispatch({
          type: CpMasterCreateActionKind.LOADING,
          payload: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  //* cp 등록
  const createCpMaster = async () => {
    const newInput = {
      ...cpCreateState.newCpMaster,
      keyword: cpCreateState.newCpMaster.keyword.trim(),
    };
    if (mode === 'create') {
      try {
        const { status } = await APICp.postMaster(newInput);
        if (status === 200) {
          toast.success('새로운 달인이 만들어졌습니다.');
        }
      } catch (error) {
        toast.error('오류가 발생했습니다.');
        console.log(error);
      }
    } else {
      try {
        const { status } = await APICp.putMaster(masterId, newInput);
        if (status === 200) {
          toast.success('달인이 수정됐습니다.');
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
      type: CpMasterCreateActionKind.LOADING,
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
        type: CpMasterCreateActionKind.CHANGE_IMAGE,
        payload: imageUrl,
      });
      dispatch({
        type: CpMasterCreateActionKind.LOADING,
        payload: false,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    getUsers();
    if (masterId) {
      getCpMaster();
    }
  }, [getCpMaster, getUsers, masterId]);
  return (
    <CpMasterCreatePresenter
      dispatch={dispatch}
      cpCreateState={cpCreateState}
      onChangeImgae={onChangeImgae}
      mode={mode}
      createCpMaster={createCpMaster}
    />
  );
};

export default CpMasterCreateContainer;
