import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { APICp } from 'src/lib/api';
import { IHiddenReporter } from 'src/types/hiddenreport';
import { IUser } from 'src/types/user';
import HiddenReportProfilePresenter from './HiddenReportProfile.Presenter';

export enum HrProfileActionKind {
  LOADING = 'LOADING',
  GET_REPORTER = 'GET_REPORTER',
}

export interface HrProfileAction {
  type: HrProfileActionKind;
  payload?: any;
}

export interface HrProfileState {
  loading: boolean;
  reporter: IHiddenReporter;
}

const HrProfileReducer = (
  state: HrProfileState,
  action: HrProfileAction,
): HrProfileState => {
  const { type, payload } = action;
  switch (type) {
    case HrProfileActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case HrProfileActionKind.GET_REPORTER:
      return {
        ...state,
        reporter: payload,
      };
  }
};

const initialState: HrProfileState = {
  loading: false,
  reporter: null,
};

interface IHrProfileProps {
  user: IUser;
}

const HiddenReportProfileContainer: React.FC<IHrProfileProps> = (
  props,
) => {
  const { user } = props;
  const navigate = useNavigate();
  const [hrProfileState, dispatch] = useReducer(
    HrProfileReducer,
    initialState,
  );

  const { reporter } = hrProfileState;
  const getReporter = useCallback(async () => {
    try {
      const { data, status } = await APICp.getReporter(
        user.hidden_reporter.id,
      );
      if (status === 200) {
        dispatch({
          type: HrProfileActionKind.GET_REPORTER,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    if (user && !user.hidden_reporter?.id) {
      navigate('/dashboard');
      toast.error('리포터를 먼저 생성해주세요');
      return;
    }
    getReporter();
  }, [user, navigate, getReporter]);

  return (
    <>
      {reporter?.id && (
        <HiddenReportProfilePresenter
          reporter={hrProfileState.reporter}
          hrProfileState={hrProfileState}
        />
      )}
    </>
  );
};

export default HiddenReportProfileContainer;
