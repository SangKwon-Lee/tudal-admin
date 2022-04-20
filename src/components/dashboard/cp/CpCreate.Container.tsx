import { useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { APICp } from 'src/lib/api';
import { UserInput } from 'src/types/user';
import CpCreatePresenter from './CpCreate.Presenter';
export enum CpCreateActionKind {
  LOADING = 'LOADING',
}
export interface CpCreateAction {
  type: CpCreateActionKind;
  payload?: any;
}
export interface CpCreateState {
  loading: boolean;
  newCp: UserInput;
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
    appId: null,
  },
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
  }
};

interface ICpCreateProps {
  mode?: string;
}

const CpCreateContainer: React.FC<ICpCreateProps> = ({ mode }) => {
  const [cpCreateState, dispatch] = useReducer(
    CpCreateReducer,
    initialState,
  );

  const navigate = useNavigate();

  //* CP 계정 생성
  const createCp = async (data: UserInput) => {
    try {
      const { status } = await APICp.postCp(data);
      if (status === 201) {
        toast.success('계정이 생성 됐습니다.');
        navigate('/dashboard/cp');
      }
    } catch (error) {
      toast.error('오류가 발생했습니다.');
      console.log(error);
    }
  };

  return (
    <CpCreatePresenter
      cpCreateState={cpCreateState}
      dispatch={dispatch}
      createCp={createCp}
      mode={mode}
    />
  );
};

export default CpCreateContainer;
