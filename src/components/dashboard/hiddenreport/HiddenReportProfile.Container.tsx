import { useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { IUser } from 'src/types/user';
import HiddenReportProfilePresenter from './HiddenReportProfile.Presenter';

export enum HrProfileActionKind {
  LOADING = 'LOADING',
}

export interface HrProfileAction {
  type: HrProfileActionKind;
  payload?: any;
}

export interface HrProfileState {
  loading: boolean;
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
  }
};

const initialState: HrProfileState = {
  loading: false,
};

interface IHrProfileProps {
  user: IUser;
}

const HiddenReportProfileContainer: React.FC<IHrProfileProps> = (
  props,
) => {
  const { user } = props;
  const navigate = useNavigate();
  const [hrProfileState] = useReducer(HrProfileReducer, initialState);

  useEffect(() => {
    if (user && !user.hidden_reporter.id) {
      navigate('/dashboard');
      toast.error('리포터를 먼저 생성해주세요');
    }
  }, [user, navigate]);

  return (
    <HiddenReportProfilePresenter
      user={user}
      hrProfileState={hrProfileState}
    />
  );
};

export default HiddenReportProfileContainer;
