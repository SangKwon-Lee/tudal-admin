import { useState, useRef, useReducer, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { cmsServer } from '../../../lib/axios';
import ExpertContentFormPresenter from './ExpertContentForm.Presenter';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';
import { useParams } from 'react-router-dom';
import { Expert } from 'src/types/expert';

interface ExpertFormProps {
  onComplete?: () => void;
  mode: string;
}

enum ExpertContentFormActionKind {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  GET_EXPERT = 'GET_EXPERT',
  CHANGE_TITLE = 'CHANGE_TITLE',
  GET_ROOM = 'GET_ROOM',
  CHANGE_ROOM = 'CHANGE_ROOM',
}
interface ExpertContentFormAction {
  type: ExpertContentFormActionKind;
  payload?: any;
}

interface newState {
  newExpert: Expert;
  loading: boolean;
  error: AxiosError<any> | boolean;
  isSubmitting: boolean;
}

const ExpertContentFormReducer = (
  state: newState,
  action: ExpertContentFormAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case ExpertContentFormActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ExpertContentFormActionKind.GET_ROOM:
      return {
        ...state,
        loading: false,
      };
    case ExpertContentFormActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
    case ExpertContentFormActionKind.GET_EXPERT:
      return {
        ...state,
        newExpert: payload,
        loading: false,
      };
    case ExpertContentFormActionKind.CHANGE_TITLE:
      return {
        ...state,
        newExpert: {
          ...state.newExpert,
          title: payload,
        },
      };
    case ExpertContentFormActionKind.CHANGE_ROOM:
      return {
        ...state,
        newExpert: {
          ...state.newExpert,
          master_room: payload,
        },
      };
  }
};

const ExpertContentFormContainer: FC<ExpertFormProps> = (props) => {
  const { mode, onComplete } = props;
  const { user } = useAuth();
  const initialState: newState = {
    newExpert: {
      title: '',
      master_room: user?.cp_rooms[0]?.id || null,
      description: '',
      contents: '',
      author: user?.id,
      source: 'web',
    },
    isSubmitting: false,
    loading: false,
    error: null,
  };
  const [newState, dispatch] = useReducer(
    ExpertContentFormReducer,
    initialState,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { expertId } = useParams();

  //* 수정 시 기존 데이터 불러오기
  const getExpert = async () => {
    dispatch({ type: ExpertContentFormActionKind.LOADING });
    try {
      if (expertId.toString() === '0') return;
      const response = await cmsServer.get<Expert>(
        `/master-feeds/${expertId.toString()}`,
      );
      if (response.status === 200) {
        const data = response.data;
        const newExpertData = {
          id: data.id,
          title: data.title,
          contents: data.contents,
          author: data.author,
          room: data.master_room.id,
        };
        dispatch({
          type: ExpertContentFormActionKind.GET_EXPERT,
          payload: newExpertData,
        });
      }
    } catch (err) {
      const response = await cmsServer.get<Expert>(
        `/expert-feeds/${expertId.toString()}`,
      );
      console.log(response);
      if (response.status === 200) {
        const data = response.data;
        const newExpertData = {
          id: data.id,
          title: data.title,
          description: data.description,
          contents: data.description,
          author: data.author,
        };
        dispatch({
          type: ExpertContentFormActionKind.GET_EXPERT,
          payload: newExpertData,
        });
      }
      console.log(err);
    }
  };

  //* 수정 모드일 때 데이터 불러오기
  useEffect(() => {
    if (mode === 'edit') {
      getExpert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* 웹 에디터에 전달되는 Props
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };
  console.log(newState.newExpert);
  //* Submit
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      if (editorRef.current) {
        const contents = log();
        const newExpert = {
          ...newState.newExpert,
          contents,
          isDeleted: 0,
        };
        if (mode === 'create') {
          try {
            const response = await cmsServer.post(
              '/master-feeds',
              newExpert,
            );
            if (response.status === 200) {
              if (onComplete) {
                onComplete();
              }
            } else {
              return;
            }
          } catch (e) {
            const response = await cmsServer.post(
              '/expert-feeds',
              newExpert,
            );
            if (response.status === 200) {
              if (onComplete) {
                onComplete();
              }
            } else {
              return;
            }
            console.log(e);
          }
        } else {
          const newExpert = {
            ...newState.newExpert,
            contents,
          };
          if (!newState.newExpert.description) {
            try {
              const response = await cmsServer.put(
                `/master-feeds/${newExpert.id}`,
                newExpert,
              );
              if (response.status === 200) {
                if (onComplete) {
                  onComplete();
                }
              } else {
                return;
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            try {
              const response = await cmsServer.put(
                `/expert-feeds/${newExpert.id}`,
                newExpert,
              );
              if (response.status === 200) {
                if (onComplete) {
                  onComplete();
                }
              } else {
                return;
              }
            } catch (err) {
              dispatch({
                type: ExpertContentFormActionKind.ERROR,
                payload: err.message,
              });
              console.error(err);
            }
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //* 제목 변경
  const handleChangeTitle = (event: any): void => {
    dispatch({
      type: ExpertContentFormActionKind.CHANGE_TITLE,
      payload: event.target.value,
    });
  };

  //* 방 변경
  const handleChangeRoom = (event: any): void => {
    dispatch({
      type: ExpertContentFormActionKind.CHANGE_ROOM,
      payload: event.target.value,
    });
  };

  return (
    <ExpertContentFormPresenter
      handleChangeTitle={handleChangeTitle}
      editorRef={editorRef}
      handleSubmit={handleSubmit}
      newState={newState}
      isSubmitting={isSubmitting}
      handleChangeRoom={handleChangeRoom}
    />
  );
};

export default ExpertContentFormContainer;
