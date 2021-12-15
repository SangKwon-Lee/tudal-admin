import { useCallback, useEffect, useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import { APICp } from 'src/lib/api';
import CPQandACreatePresenter from './CpQandACreate.Presenter';
import useAuth from 'src/hooks/useAuth';
import CONF from 'src/etc/config';
import axios from 'axios';

const headers = {
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
  },
};

export enum CPQandACreateActionKind {
  LOADING = 'LOADING',
  GET_FORM = 'GET_FORM',
  CHANGE_CATEGORY = 'CHANGE_CATEGORY',
}

export const QA_CATEGORIES = [
  '요청사항',
  '버그',
  '수정 사항',
  '기타',
];
export interface CPQandACreateAction {
  type: CPQandACreateActionKind;
  payload?: any;
}

export interface IQuestionForm {
  id?: number;
  title: string;
  category: string;
  description: string;
  isAnswer: boolean;
  isCompleted: boolean;
  writer: number;
}

export interface ICPQandACreateState {
  loading: boolean;
  form: IQuestionForm;
}

const initialState: ICPQandACreateState = {
  loading: false,
  form: {
    title: '',
    category: QA_CATEGORIES[0],
    description: '',
    isAnswer: false,
    isCompleted: false,
    writer: null,
  },
};

const CPQandACreateReducer = (
  state: ICPQandACreateState,
  action: CPQandACreateAction,
): ICPQandACreateState => {
  const { type, payload } = action;
  switch (type) {
    case CPQandACreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };

    case CPQandACreateActionKind.GET_FORM:
      return {
        ...state,
        form: payload,
        loading: false,
      };
    case CPQandACreateActionKind.CHANGE_CATEGORY:
      const {
        target: { name, value },
      } = payload;
      return {
        ...state,
        form: { ...state.form, [name]: value },
      };
  }
};

interface ICpMasterCreateProps {
  mode?: string;
}
const CPQandACreateContainer: React.FC<ICpMasterCreateProps> = (
  props,
) => {
  const { qId } = useParams();
  const { mode } = props;
  console.log(mode);

  const [state, dispatch] = useReducer(
    CPQandACreateReducer,
    initialState,
  );

  const { user } = useAuth();

  const editorRef = useRef(null);
  const navigate = useNavigate();

  //* 기존 데이터 불러오기
  const getForm = useCallback(async () => {
    console.log('edit mode, get Form');
    dispatch({
      type: CPQandACreateActionKind.LOADING,
      payload: true,
    });

    try {
      const { data, status } = await APICp.getQandA(qId);
      console.log('edit mode, get Form', data);
      if (status === 200) {
        dispatch({
          type: CPQandACreateActionKind.GET_FORM,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [qId]);

  //* 웹 에디터에 전달되는 Props
  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };

  //* 문의사항 등록 / 수정
  const postForm = async (data: IQuestionForm) => {
    try {
      const _data = { ...data, writer: user.id };
      if (editorRef.current) {
        const _description = log();
        console.log(_description);
        _data.description = _description;
      }

      if (mode === 'create') {
        const { data, status } = await APICp.postQandA(_data);
        if (status === 200) {
          toast.success('문의사항이 등록되었습니다.');
          navigate('/dashboard/qas');
          await axios.post(
            CONF.CP_QA_SLACK_BOT,
            {
              text: `CP 문의사항이 등록되었습니다. \n${data.title}`,
            },
            headers,
          );
        }
      } else {
        const { status } = await APICp.putQandA(qId, _data);
        if (status === 200) {
          navigate('/dashboard/qas');
          toast.success('등록되었습니다.');
        }
      }
    } catch (error) {
      toast.error('에러가 발생했습니다.');
      console.log(error);
    }
  };

  useEffect(() => {
    mode === 'edit' && getForm();
  }, [getForm, mode]);

  return (
    <CPQandACreatePresenter
      editorRef={editorRef}
      dispatch={dispatch}
      state={state}
      mode={mode}
      postForm={postForm}
    />
  );
};

export default CPQandACreateContainer;
