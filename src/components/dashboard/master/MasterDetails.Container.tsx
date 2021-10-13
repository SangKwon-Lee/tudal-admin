import { useCallback, useEffect, useReducer } from 'react';
import type { Master } from '../../../types/master';
import axios from 'src/lib/axios';
import { useParams } from 'react-router-dom';
import useMounted from 'src/hooks/useMounted';
import MasterDetailsPresenter from './MasterDetails.Presenter';
import { AxiosError } from 'axios';

enum MasterDetailsActionKind {
  LOADING = 'LOADING',
  GET_EXPERT = 'GET_EXPERT',
  ERROR = 'ERROR',
}
interface MasterDetailsAction {
  type: MasterDetailsActionKind;
  payload?: any;
}

interface newState {
  master: Master;
  loading: boolean;
  error: AxiosError<any> | boolean;
}
const MasterDetailsReducer = (
  state: newState,
  action: MasterDetailsAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case MasterDetailsActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case MasterDetailsActionKind.GET_EXPERT:
      return {
        ...state,
        master: payload,
        loading: false,
      };
    case MasterDetailsActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
  }
};

const initialState: newState = {
  master: {},
  loading: false,
  error: null,
};

const MasterDetailsContainer = () => {
  const mounted = useMounted();
  const { masterId } = useParams();
  const [newState, dispatch] = useReducer(
    MasterDetailsReducer,
    initialState,
  );

  const getMaster = useCallback(async () => {
    dispatch({ type: MasterDetailsActionKind.LOADING });
    try {
      const response = await axios.get<Master>(
        `/master-feeds/${masterId}`,
      );

      if (mounted) {
        dispatch({
          type: MasterDetailsActionKind.GET_EXPERT,
          payload: response.data,
        });
      }
    } catch (err) {
      const response = await axios.get<Master>(
        `/expert-feeds/${masterId}`,
      );
      dispatch({
        type: MasterDetailsActionKind.GET_EXPERT,
        payload: response.data,
      });
      console.log(err);
      dispatch({ type: MasterDetailsActionKind.ERROR, payload: err });
    }
  }, [mounted, masterId]);

  useEffect(() => {
    getMaster();
  }, [getMaster]);

  return (
    <>
      <MasterDetailsPresenter newState={newState} />
    </>
  );
};

export default MasterDetailsContainer;
