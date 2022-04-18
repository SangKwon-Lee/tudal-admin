import { useCallback, useEffect, useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { IUser } from 'src/types/user';
import CpMasterCreatePresenter from './CpMasterCreate.Presenter';
import { IBuckets } from '../../common/conf/aws';
import { registerImage } from 'src/utils/registerImage';
import useAuth from 'src/hooks/useAuth';
import { IMasterCreateForm } from 'src/types/master';

export enum CpMasterCreateActionKind {
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  GET_MASTER = 'GET_MASTER',
  GET_USER = 'GET_USER',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
  PRE_CROP_IMAGE = 'PRE_CROP_IMAGE',
  SAVE_CROP_IMAGE = 'SAVE_CROP_IMAGE',
}

export interface CpMasterCreateAction {
  type: CpMasterCreateActionKind;
  payload?: any;
}

export interface CpMasterCreateState {
  loading: boolean;
  newCpMaster: IMasterCreateForm;
  newMasterUser: IUser;
  users: IUser[];
  cropImg: string;
  saveCropImg: string;
}

const initialState: CpMasterCreateState = {
  loading: false,
  newCpMaster: {
    nickname: '',
    subscription_days: null,
    price_gold: null,
    profile: '',
    catchphrase: '',
    keyword: '',
    profile_image_url: '',
    type: 'free',
    group: '',
  },
  newMasterUser: null,
  users: [],
  cropImg: '',
  saveCropImg: '',
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
        loading: false,
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
        loading: false,
      };
    case CpMasterCreateActionKind.GET_USER:
      return {
        ...state,
        newMasterUser: payload,
      };
    case CpMasterCreateActionKind.PRE_CROP_IMAGE:
      return {
        ...state,
        cropImg: payload,
      };
    case CpMasterCreateActionKind.SAVE_CROP_IMAGE:
      return {
        ...state,
        saveCropImg: payload,
      };
  }
};

interface ICpMasterCreateProps {
  mode?: string;
}
const CpMasterCreateContainer: React.FC<ICpMasterCreateProps> = (
  props,
) => {
  const { masterId, userId } = useParams();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const mode = props.mode || 'create';
  const navigate = useNavigate();
  const [cpCreateState, dispatch] = useReducer(
    CpMasterCreateReducer,
    initialState,
  );

  //* 기존 데이터 불러오기
  const getCpMaster = useCallback(async () => {
    dispatch({
      type: CpMasterCreateActionKind.LOADING,
      payload: true,
    });
    if (mode === 'selectAndCreate') {
      try {
        const { data } = await APICp.getUser(userId);
        dispatch({
          type: CpMasterCreateActionKind.GET_USER,
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data, status } = await APICp.getMaster(masterId);
        if (status === 200) {
          dispatch({
            type: CpMasterCreateActionKind.GET_MASTER,
            payload: data,
          });
          dispatch({
            type: CpMasterCreateActionKind.GET_USER,
            payload: data.user,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterId, mode]);

  //* 유저 선택 불러오기
  const getUsers = useCallback(async () => {
    dispatch({
      type: CpMasterCreateActionKind.LOADING,
      payload: true,
    });
    if (mode === 'edit') {
      try {
        const { data } = await APICp.getUsers();
        dispatch({
          type: CpMasterCreateActionKind.GET_USERS,
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await APICp.getUsersNoMaster();
        dispatch({
          type: CpMasterCreateActionKind.GET_USERS,
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [mode]);

  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };

  //* cp 등록
  const createCpMaster = async (data: IMasterCreateForm) => {
    const imgUrl = await registerImage(
      cpCreateState.saveCropImg,
      IBuckets.CP_PHOTO,
    );

    const profile = log();

    let master: IMasterCreateForm = {
      ...data,
      profile,
      keyword: data.keyword.trim(),
      user: cpCreateState.newMasterUser.id,
      profile_image_url: imgUrl,
    };

    try {
      if (mode === 'edit') {
        const { status } = await APICp.putMaster(masterId, master);
        if (status === 200) {
          toast.success('달인이 수정됐습니다.');
          navigate('/dashboard');
        }
      } else {
        const { status } = await APICp.postMaster(master);
        if (status === 200) {
          toast.success('새로운 달인이 만들어졌습니다.');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mode === 'create') {
      getUsers();
      return;
    }

    getCpMaster();
  }, [getCpMaster, getUsers, mode]);

  return (
    <CpMasterCreatePresenter
      dispatch={dispatch}
      cpCreateState={cpCreateState}
      mode={mode}
      createCpMaster={createCpMaster}
      user={user}
      editorRef={editorRef}
    />
  );
};

export default CpMasterCreateContainer;
