import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { CP_Master } from 'src/types/cp';
import { IUser } from 'src/types/user';
import CpMasterCreatePresenter from './CpMasterCreate.Presenter';
import { bucket_hiddenbox } from '../../common/conf/aws';
import { registerImage } from 'src/utils/registerImage';
export enum CpMasterCreateActionKind {
  LOADING = 'LOADING',
  GET_USERS = 'GET_USERS',
  GET_MASTER = 'GET_MASTER',
  GET_USER_ID = 'GET_USER_ID',
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
  newCpMaster: CP_Master;
  users: IUser[];
  userId: number;
  cropImg: string;
  saveCropImg: string;
}

const initialState: CpMasterCreateState = {
  loading: false,
  newCpMaster: {
    nickname: '',
    intro: '',
    keyword: '',
    user: 1,
    profile_image_url: '',
  },
  users: [],
  userId: 0,
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
    case CpMasterCreateActionKind.GET_USER_ID:
      return {
        ...state,
        userId: payload,
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
  const { masterId } = useParams();
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
    try {
      const { data, status } = await APICp.getMaster(masterId);
      let newData = {
        ...data,
        user: data.user.username,
      };
      if (status === 200) {
        dispatch({
          type: CpMasterCreateActionKind.GET_MASTER,
          payload: newData,
        });
        dispatch({
          type: CpMasterCreateActionKind.GET_USER_ID,
          payload: data.user.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [masterId]);

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

  //* cp 등록
  const createCpMaster = async (data: CP_Master) => {
    if (mode === 'create') {
      let newInput = {
        ...data,
        keyword: data.keyword.trim(),
      };
      try {
        const imgUrl = await registerImage(
          cpCreateState.saveCropImg,
          bucket_hiddenbox,
        );
        newInput = {
          ...newInput,
          profile_image_url: imgUrl,
        };
        const { status, data } = await APICp.postMaster(newInput);
        if (status === 200) {
          const input = {
            master: data.id,
            name: data.nickname,
          };
          try {
            const { status: chnnelSattus } =
              await APICp.postMasterChannel(input);
            if (chnnelSattus === 200) {
              toast.success('새로운 달인이 만들어졌습니다.');
              navigate('/dashboard/cp');
            }
          } catch (error) {
            toast.error('오류가 발생했습니다.');
            console.log(error);
          }
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
          keyword: data.keyword.trim(),
          profile_image_url: imgUrl,
          user: cpCreateState.userId,
        };
        const { status } = await APICp.putMaster(masterId, newInput);
        if (status === 200) {
          navigate('/dashboard/cp');
          toast.success('달인이 수정됐습니다.');
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
  //     type: CpMasterCreateActionKind.LOADING,
  //     payload: true,
  //   });
  //   try {
  //     const imageUrl = await registerImage(file, bucket_hiddenbox);
  //     dispatch({
  //       type: CpMasterCreateActionKind.CHANGE_IMAGE,
  //       payload: imageUrl,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

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
      mode={mode}
      createCpMaster={createCpMaster}
    />
  );
};

export default CpMasterCreateContainer;
