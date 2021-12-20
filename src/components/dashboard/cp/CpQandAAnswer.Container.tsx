import { useCallback, useEffect, useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { APICp } from 'src/lib/api';
import useAuth from 'src/hooks/useAuth';
import CPQandACreateAnswerPresenter from './CpQandAAnswer.Presenter';
import { ICPQuestion } from 'src/types/cp';

export enum CPQandAAnswerActionKind {
  LOADING = 'LOADING',
  GET_FORM = 'GET_FORM',
  GET_QUESTION = 'GET_QUESTION',
  CHANGE_CATEGORY = 'CHANGE_CATEGORY',
}

export const QA_CATEGORIES = [
  '요청사항',
  '버그',
  '수정 사항',
  '기타',
];
export interface CPQandAAnswerAction {
  type: CPQandAAnswerActionKind;
  payload?: any;
}

export interface IAnswerForm {
  id?: number;
  title: string;
  description: string;
  isAnswer: boolean;
  isCompleted: boolean;
  writer: number;
}

export interface ICPQandAAnswerState {
  loading: boolean;
  question: ICPQuestion;
  form: IAnswerForm;
}

const initialState: ICPQandAAnswerState = {
  loading: false,
  question: null,
  form: {
    title: '',
    description: '',
    isAnswer: false,
    isCompleted: false,
    writer: null,
  },
};

const CPQandACreateReducer = (
  state: ICPQandAAnswerState,
  action: CPQandAAnswerAction,
): ICPQandAAnswerState => {
  const { type, payload } = action;
  switch (type) {
    case CPQandAAnswerActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CPQandAAnswerActionKind.GET_QUESTION:
      return {
        ...state,
        question: payload,
      };

    case CPQandAAnswerActionKind.GET_FORM:
      return {
        ...state,
        form: payload,
        loading: false,
      };
    case CPQandAAnswerActionKind.CHANGE_CATEGORY:
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
  qId: string;
  aId: string;
}
const CPQandAAnswerContainer: React.FC<ICpMasterCreateProps> = (
  props,
) => {
  const { mode, qId, aId } = props;

  const [state, dispatch] = useReducer(
    CPQandACreateReducer,
    initialState,
  );

  const { user } = useAuth();

  const editorRef = useRef(null);
  const navigate = useNavigate();

  //* 기존 데이터 불러오기
  const getForm = useCallback(async () => {
    dispatch({
      type: CPQandAAnswerActionKind.LOADING,
      payload: true,
    });

    try {
      const { data, status } = await APICp.getQandA(aId);
      if (status === 200) {
        dispatch({
          type: CPQandAAnswerActionKind.GET_FORM,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [aId]);

  const getQuestion = useCallback(async () => {
    dispatch({
      type: CPQandAAnswerActionKind.LOADING,
      payload: true,
    });

    try {
      const { data, status } = await APICp.getQandA(qId);
      if (status === 200) {
        dispatch({
          type: CPQandAAnswerActionKind.GET_QUESTION,
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

  const postAnswer = async (data: IAnswerForm) => {
    try {
      const _data = {
        ...data,
        writer: user.id,
        target: qId,
        isAnswer: true,
      };

      if (editorRef.current) {
        const _description = log();
        _data.description = _description;
      }

      if (mode === 'create') {
        const { status } = await APICp.postQandA(_data);
        if (status === 200) {
          toast.success('답변이 등록되었습니다.');
          navigate(`/dashboard/qas/${qId}?answer=true`);
        }
      } else {
        const { status } = await APICp.putQandA(aId, _data);
        if (status === 200) {
          navigate('/dashboard/qas');
          toast.success('답변이 수정되었습니다.');
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

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  return (
    <CPQandACreateAnswerPresenter
      editorRef={editorRef}
      dispatch={dispatch}
      state={state}
      mode={mode}
      postAnswer={postAnswer}
    />
  );
};

export default CPQandAAnswerContainer;
