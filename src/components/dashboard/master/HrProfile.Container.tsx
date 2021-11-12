import { useReducer } from 'react';
import { IUser } from 'src/types/user';
import HrProfilePresenter from './HrProfile.Presenter';

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

const HrProfileContainer: React.FC<IHrProfileProps> = (props) => {
  const { user } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hrProfileState, dispatch] = useReducer(
    HrProfileReducer,
    initialState,
  );

  return (
    <HrProfilePresenter user={user} hrProfileState={hrProfileState} />
  );
};

export default HrProfileContainer;
