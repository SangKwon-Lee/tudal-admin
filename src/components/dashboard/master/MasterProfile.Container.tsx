import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { APIMaster } from 'src/lib/api';
import { IMasterFeed } from 'src/types/master';
import { IUser } from 'src/types/user';
import MasterProfilePresenter from './MasterProfile.Presenter';

export enum MasterProfileActionKind {
  LOADING = 'LOADING',
  GET_MASTER_FEEDS = 'GET_MASTER_FEEDS',
}

export interface MasterProfileAction {
  type: MasterProfileActionKind;
  payload?: any;
}

export interface MasterProfileState {
  loading: boolean;
  feeds: IMasterFeed[];
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
    case MasterProfileActionKind.GET_MASTER_FEEDS:
      return {
        ...state,
        feeds: payload,
      };
  }
};

const initialState: MasterProfileState = {
  loading: false,
  feeds: [],
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

  const getMasterFeed = useCallback(async () => {
    dispatch({
      type: MasterProfileActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APIMaster.getFeeds(
        '',
        user.master.id,
      );
      if (status === 200) {
        dispatch({
          type: MasterProfileActionKind.GET_MASTER_FEEDS,
          payload: data.slice(0, 3),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.master?.id) {
      getMasterFeed();
    }
  }, [getMasterFeed, user]);

  useEffect(() => {
    if (user && !user.masters[0]?.id) {
      navigate('/dashboard');
      toast.error('달인을 먼저 생성해주세요');
    }
  }, [user, navigate]);

  return (
    <MasterProfilePresenter
      user={props.user}
      masterProfileState={masterProfileState}
    />
  );
};

export default MasterProfileContainer;
