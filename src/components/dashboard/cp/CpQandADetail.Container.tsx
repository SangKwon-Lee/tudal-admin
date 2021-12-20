import { useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { APICp } from 'src/lib/api';
import { ICPQuestion } from 'src/types/cp';
import CPQandADetailPresenter from './CpQandADetail.Presenter';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import { Dialog } from '@material-ui/core';

export enum CPQandADetailActionKind {
  LOADING = 'LOADING',
  GET_QUESTION = 'GET_QUESTION',
  HANDLE_MODAL = 'HANDLE_MODAL',
}

export interface CPQandADetailAction {
  type: CPQandADetailActionKind;
  payload?: any;
}

export interface ICPQandADetailState {
  loading: boolean;
  isOpenModal: boolean;
  question: ICPQuestion;
}

const initialState: ICPQandADetailState = {
  loading: true,
  question: null,
  isOpenModal: false,
};

const CPQandADeatilReducer = (
  state: ICPQandADetailState,
  action: CPQandADetailAction,
): ICPQandADetailState => {
  const { type, payload } = action;
  switch (type) {
    case CPQandADetailActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };

    case CPQandADetailActionKind.GET_QUESTION:
      return {
        ...state,
        question: payload,
        loading: false,
      };

    case CPQandADetailActionKind.HANDLE_MODAL:
      return {
        ...state,
        isOpenModal: payload,
      };
  }
};

interface IProps {
  qId: string;
  fromAnswer: boolean;
}
const QandADetailContainer: React.FC<IProps> = (props) => {
  const { qId, fromAnswer } = props;
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(
    CPQandADeatilReducer,
    initialState,
  );
  const { question, loading, isOpenModal } = state;
  const getQuestion = useCallback(async () => {
    try {
      const { data, status } = await APICp.getQandA(qId);

      if (status === 200 && data.id) {
        dispatch({
          type: CPQandADetailActionKind.GET_QUESTION,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [qId]);

  const postConfirm = useCallback(async () => {
    try {
      const isCompleted = !question.isCompleted;
      const { data, status } = await APICp.putQandA(question.id, {
        isCompleted,
      });

      if (status === 200 && data.id) {
        dispatch({
          type: CPQandADetailActionKind.GET_QUESTION,
          payload: data,
        });
        navigate(`/dashboard/qas/${question.id}`);
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  useEffect(() => {
    dispatch({
      type: CPQandADetailActionKind.HANDLE_MODAL,
      payload: fromAnswer,
    });
  }, [fromAnswer, qId]);

  const isOpenConfirm = !question?.isCompleted && isOpenModal;

  console.log('here', isOpenConfirm);
  return (
    <>
      <CPQandADetailPresenter
        question={question}
        postConfirm={postConfirm}
        loading={loading}
      />
      <Dialog
        aria-labelledby="ConfirmModal"
        open={isOpenConfirm}
        onClose={() => {
          dispatch({
            type: CPQandADetailActionKind.HANDLE_MODAL,
            payload: false,
          });
        }}
      >
        <ConfirmModal
          title={'문의사항?'}
          content={'해당 문의사항을 완료 처리 하시겠습니까?.'}
          confirmTitle={'완료'}
          type="CONFIRM"
          handleOnClick={postConfirm}
          handleOnCancel={() => {
            dispatch({
              type: CPQandADetailActionKind.HANDLE_MODAL,
              payload: false,
            });
          }}
        />
      </Dialog>
    </>
  );
};

export default QandADetailContainer;
