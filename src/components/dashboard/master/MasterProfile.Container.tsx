import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { APICp } from 'src/lib/api';
import { IMaster } from 'src/types/master';
import { IUser } from 'src/types/user';
import MasterProfilePresenter from './MasterProfile.Presenter';

export enum MasterProfileActionKind {
  LOADING = 'LOADING',
  GET_MASTER = 'GET_MASTER',
}

export interface MasterProfileAction {
  type: MasterProfileActionKind;
  payload?: any;
}

export interface MasterProfileState {
  loading: boolean;
  masters: IMaster[];
}

const MasterProfileReducer = (
  state: MasterProfileState,
  action: MasterProfileAction,
): MasterProfileState => {
  const { type, payload } = action;
  switch (type) {
    case MasterProfileActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case MasterProfileActionKind.GET_MASTER:
      return {
        ...state,
        masters: payload,
      };
  }
};

const initialState: MasterProfileState = {
  loading: false,
  masters: [],
};
interface IMasterProfileProps {
  user: IUser;
}

const MasterProfileContainer: React.FC<IMasterProfileProps> = (
  props,
) => {
  const { user } = props;
  const navigate = useNavigate();
  const [masterProfileState, dispatch] = useReducer(
    MasterProfileReducer,
    initialState,
  );

  const { masters } = masterProfileState;
  const getMasters = useCallback(async () => {
    dispatch({
      type: MasterProfileActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APICp.getUser(user.id);

      if (status === 200) {
        dispatch({
          type: MasterProfileActionKind.GET_MASTER,
          payload: data.masters,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.master?.id) {
      getMasters();
    }
  }, [getMasters, user]);

  useEffect(() => {
    if (user && !user.masters[0]?.id) {
      navigate('/dashboard');
      toast.error('달인을 먼저 생성해주세요');
    }
    getMasters();
  }, [user, navigate, getMasters]);

  return (
    <>
      {masters.length && (
        <MasterProfilePresenter
          masters={masters}
          masterProfileState={masterProfileState}
        />
      )}
    </>
  );
};

export default MasterProfileContainer;
