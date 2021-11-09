import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP_Master } from 'src/types/cp';
import { User } from 'src/types/user';
import CpMasterCreatePresenter from './CpMasterCreate.Presenter';
import { bucket_hiddenbox } from '../../common/conf/aws';
import { registerImage } from 'src/utils/registerImage';
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
  newCpMaster: CP_Master;
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
        loading: false,
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
      const imageUrl = await registerImage(file, bucket_hiddenbox);
      dispatch({
        type: CpMasterCreateActionKind.CHANGE_IMAGE,
        payload: imageUrl,
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
