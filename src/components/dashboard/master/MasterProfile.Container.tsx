import dayjs from 'dayjs';
import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { APICp, APIMaster } from 'src/lib/api';
import { IMaster } from 'src/types/master';
import { IUser } from 'src/types/user';
import MasterProfilePresenter from './MasterProfile.Presenter';

export enum MasterProfileActionKind {
  LOADING = 'LOADING',
  GET_MASTER = 'GET_MASTER',
  GET_PAYMENTS = 'GET_PAYMENTS',
  CHANGE_STARTDATE = 'CHANGE_STARTDATE',
  CHANGE_ENDDATE = 'CHANGE_ENDDATE',
}

export interface MasterProfileAction {
  type: MasterProfileActionKind;
  payload?: any;
}

export interface MasterProfileState {
  loading: boolean;
  masters: IMaster[];
  total: {
    totalIncome: number;
    numOfPayments: number;
  };
  query: {
    startDate: string;
    endDate: string;
  };
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
    case MasterProfileActionKind.GET_PAYMENTS: {
      return {
        ...state,
        total: payload,
      };
    }
    case MasterProfileActionKind.CHANGE_STARTDATE: {
      return {
        ...state,
        query: {
          ...state.query,
          startDate: payload,
        },
      };
    }
    case MasterProfileActionKind.CHANGE_ENDDATE: {
      return {
        ...state,
        query: {
          ...state.query,
          endDate: payload,
        },
      };
    }
  }
};

const initialState: MasterProfileState = {
  loading: false,
  masters: [],
  total: {
    totalIncome: 0,
    numOfPayments: 0,
  },
  query: {
    startDate: dayjs('2021-10-10').format('YYYY-MM-DD'),
    endDate: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
  },
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

  const getMasterPayments = useCallback(async () => {
    try {
      const { data } = await APIMaster.getMasterPayments(
        user.id,
        masterProfileState.query,
      );
      console.log(data);
      dispatch({
        type: MasterProfileActionKind.GET_PAYMENTS,
        payload: data,
      });
    } catch (e) {
      console.log(e);
    }
  }, [user.id, masterProfileState.query]);

  useEffect(() => {
    if (user?.master?.id) {
      getMasters();
    }
  }, [getMasters, user]);

  useEffect(() => {
    getMasterPayments();
  }, [getMasterPayments]);

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
          dispatch={dispatch}
        />
      )}
    </>
  );
};

export default MasterProfileContainer;
