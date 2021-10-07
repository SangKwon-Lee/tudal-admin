import { useCallback, useEffect, useReducer } from 'react';
import type { Expert } from '../../../types/expert';
import axios from 'src/lib/axios';
import { useParams } from 'react-router-dom';
import useMounted from 'src/hooks/useMounted';
import ExpertDetailsPresenter from './ExpertDetails.Presenter';
import { AxiosError } from 'axios';

enum ExpertDetailsActionKind {
  LOADING = 'LOADING',
  GET_EXPERT = 'GET_EXPERT',
  ERROR = 'ERROR',
}
interface ExpertDetailsAction {
  type: ExpertDetailsActionKind;
  payload?: any;
}

interface newState {
  expert: Expert;
  loading: boolean;
  error: AxiosError<any> | boolean;
}
const ExpertDetailsReducer = (
  state: newState,
  action: ExpertDetailsAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case ExpertDetailsActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ExpertDetailsActionKind.GET_EXPERT:
      return {
        ...state,
        expert: payload,
        loading: false,
      };
    case ExpertDetailsActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
  }
};

const initialState: newState = {
  expert: {},
  loading: false,
  error: null,
};

const ExpertDetailsContainer = () => {
  const mounted = useMounted();
  const { expertId } = useParams();
  const [newState, dispatch] = useReducer(
    ExpertDetailsReducer,
    initialState,
  );

  const getExpert = useCallback(async () => {
    dispatch({ type: ExpertDetailsActionKind.LOADING });
    try {
      const response = await axios.get<Expert>(
        `/cp-feeds/${expertId}`,
      );

      if (mounted) {
        dispatch({
          type: ExpertDetailsActionKind.GET_EXPERT,
          payload: response.data,
        });
      }
    } catch (err) {
      const response = await axios.get<Expert>(
        `/expert-feeds/${expertId}`,
      );
      dispatch({
        type: ExpertDetailsActionKind.GET_EXPERT,
        payload: response.data,
      });
      console.log(err);
      dispatch({ type: ExpertDetailsActionKind.ERROR, payload: err });
    }
  }, [mounted, expertId]);

  useEffect(() => {
    getExpert();
  }, [getExpert]);

  return (
    <>
      <ExpertDetailsPresenter newState={newState} />
    </>
  );
};

export default ExpertDetailsContainer;
