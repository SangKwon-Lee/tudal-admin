import { useCallback, useEffect, useReducer } from 'react';
import type { IMasterFeedLikes, IMasterFeed } from 'src/types/master';
import { useParams } from 'react-router-dom';
import useMounted from 'src/hooks/useMounted';
import MasterDetailsPresenter from './MasterDetails.Presenter';
import { APIMaster } from 'src/lib/api';

export enum MasterDetailsActionKind {
  LOADING = 'LOADING',

  // Load APIS
  GET_MASTER = 'GET_MASTER',
  GET_LIKES = 'GET_LIKES',
}
export interface MasterDetailsAction {
  type: MasterDetailsActionKind;
  payload?: any;
}

export interface MasterDetailsState {
  master: IMasterFeed;
  loading: boolean;
  likes: IMasterFeedLikes[];
}
const MasterDetailsReducer = (
  state: MasterDetailsState,
  action: MasterDetailsAction,
): MasterDetailsState => {
  const { type, payload } = action;
  switch (type) {
    case MasterDetailsActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case MasterDetailsActionKind.GET_MASTER:
      return {
        ...state,
        master: payload,
        loading: false,
      };
    case MasterDetailsActionKind.GET_LIKES:
      return {
        ...state,
        likes: payload,
        loading: false,
      };
  }
};

const initialState: MasterDetailsState = {
  master: null,
  loading: false,
  likes: [],
};

const MasterDetailsContainer = () => {
  const mounted = useMounted();
  const { masterId } = useParams();
  const [masterDetailState, dispatch] = useReducer(
    MasterDetailsReducer,
    initialState,
  );

  const getMaster = useCallback(async () => {
    dispatch({ type: MasterDetailsActionKind.LOADING });
    try {
      const { data, status } = await APIMaster.getDetailFeed(
        masterId,
      );
      const { data: likeData, status: likeStatus } =
        await APIMaster.getDetailFeedLike(masterId);

      if (mounted && status === 200 && likeStatus === 200) {
        dispatch({
          type: MasterDetailsActionKind.GET_MASTER,
          payload: data,
        });
        dispatch({
          type: MasterDetailsActionKind.GET_LIKES,
          payload: likeData,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [mounted, masterId]);

  useEffect(() => {
    getMaster();
  }, [getMaster]);

  return (
    <>
      <MasterDetailsPresenter masterDetailState={masterDetailState} />
    </>
  );
};

export default MasterDetailsContainer;
