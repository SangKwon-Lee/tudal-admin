import { useReducer } from 'react';
import toast from 'react-hot-toast';
import { APICp } from 'src/lib/api';
import { UserInput } from 'src/types/user';
import CpCreatePresenter from './CpCreate.Presenter';

export enum CpCreateActionKind {
  LOADING = 'LOADING',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  CHANGE_EMAIL_CHECK = 'CHANGE_EMAIL_CHECK',
  CHANGE_CONTACT_EMAIL_CHECK = 'CHANGE_CONTACT_EMAIL_CHECK',
}
export interface CpCreateAction {
  type: CpCreateActionKind;
  payload?: any;
}
export interface CpCreateState {
  loading: boolean;
  newCp: UserInput;
  emailCheck: boolean;
  contactEmailCheck: boolean;
}
const initialState: CpCreateState = {
  loading: false,
  newCp: {
    nickname: '',
    contact_email: '',
    email: '',
    password: '',
    phone_number: '',
    role: 1,
    type: 'admin',
    username: '',
  },
  emailCheck: false,
  contactEmailCheck: false,
};

const CpCreateReducer = (
  state: CpCreateState,
  action: CpCreateAction,
): CpCreateState => {
  const { type, payload } = action;
  switch (type) {
    case CpCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CpCreateActionKind.CHANGE_INPUT:
      return {
        ...state,
        newCp: {
          ...state.newCp,
          [payload.target.name]: payload.target.value,
        },
      };
    case CpCreateActionKind.CHANGE_EMAIL:
      return {
        ...state,
        newCp: {
          ...state.newCp,
          [payload.target.name]: payload.target.value,
        },
      };
    case CpCreateActionKind.CHANGE_EMAIL_CHECK:
      return {
        ...state,
        emailCheck: payload,
      };
    case CpCreateActionKind.CHANGE_CONTACT_EMAIL_CHECK:
      return {
        ...state,
        contactEmailCheck: payload,
      };
  }
};
interface ICpCreateProps {
  mode?: string;
}
const CpCreateContainer: React.FC<ICpCreateProps> = (props) => {
  const [cpCreateState, dispatch] = useReducer(
    CpCreateReducer,
    initialState,
  );

  //* CP 계정 생성
  const createCp = async () => {
    try {
      const { status } = await APICp.postCp(cpCreateState.newCp);
      if (status === 200) {
        toast.success('계정이 생성 됐습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkEmail = (e: any) => {
    var regExp =
      // eslint-disable-next-line no-useless-escape
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    dispatch({ type: CpCreateActionKind.CHANGE_EMAIL, payload: e });
    const check = regExp.test(e.target.value);
    if (e.target.name === 'email') {
      dispatch({
        type: CpCreateActionKind.CHANGE_EMAIL_CHECK,
        payload: !check,
      });
    } else {
      dispatch({
        type: CpCreateActionKind.CHANGE_CONTACT_EMAIL_CHECK,
        payload: !check,
      });
    }
  };

  return (
    <CpCreatePresenter
      cpCreateState={cpCreateState}
      dispatch={dispatch}
      createCp={createCp}
      mode={props.mode}
      checkEmail={checkEmail}
    />
  );
};

export default CpCreateContainer;
