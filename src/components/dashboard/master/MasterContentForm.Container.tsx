import {
  useState,
  useRef,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import type { FC } from 'react';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { cmsServer } from '../../../lib/axios';
import MasterContentFormPresenter from './MasterContentForm.Presenter';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';
import { useParams } from 'react-router-dom';
import {
  IMasterRoom,
  IMasterChannel,
  IMaster,
} from 'src/types/master';
import useAsync from 'src/hooks/useAsync';
import { Stock, Tag } from 'src/types/schedule';
import { APIMaster, APIStock, APITag } from 'src/lib/api';
import _ from 'lodash';
import toast from 'react-hot-toast';

interface MasterFormProps {
  onComplete?: () => void;
  mode: string;
}

export enum MasterContentFormActionKind {
  LOADING = 'LOADING',

  // Load APIS
  GET_FEED = 'GET_FEED',
  GET_MASTER = 'GET_MASTER',
  GET_ROOM = 'GET_ROOM',
  // Changes
  NO_ROOM = 'NO_ROOM',
  CHANGE_TAGS = 'CHANGE_TAGS',
  CHANGE_STOCKS = 'CHANGE_STOCKS',
  REGEX_LINK = 'REGEX_LINK',
  IS_HAS_ROOM = 'IS_HAS_ROOM',
  CHANGE_INPUT = 'CHANGE_INPUT',
}
export interface MasterContentFormAction {
  type: MasterContentFormActionKind;
  payload?: any;
}

interface IMasterFeedForm {
  id?: number;
  title: string;
  external_link: string;
  master_room: string;
  contents: string;
  description: string;
  source: string;
  master: number;
  stocks: Array<Stock>;
  tags: Array<Tag>;
}

export interface MasterContentFormState {
  newFeed: IMasterFeedForm;
  loading: boolean;
  error: AxiosError<any> | boolean;
  isSubmitting: boolean;
  master_room: IMasterRoom[];
  masters: IMaster[];
  submitError: boolean;
  isHasRoom: boolean;
}

const MasterContentFormReducer = (
  state: MasterContentFormState,
  action: MasterContentFormAction,
): MasterContentFormState => {
  const { type, payload } = action;
  switch (type) {
    case MasterContentFormActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case MasterContentFormActionKind.GET_FEED:
      return {
        ...state,
        newFeed: payload,
        loading: false,
      };
    case MasterContentFormActionKind.GET_ROOM:
      return {
        ...state,
        master_room: payload,
        newFeed: {
          ...state.newFeed,
          master_room: payload[0].id,
        },
      };
    case MasterContentFormActionKind.CHANGE_TAGS:
      return {
        ...state,
        newFeed: {
          ...state.newFeed,
          tags: payload,
        },
      };
    case MasterContentFormActionKind.CHANGE_STOCKS:
      return {
        ...state,
        newFeed: {
          ...state.newFeed,
          stocks: payload,
        },
      };
    case MasterContentFormActionKind.GET_MASTER:
      return {
        ...state,
        masters: payload,
        newFeed: {
          ...state.newFeed,
          master: payload[0].id,
        },
      };
    case MasterContentFormActionKind.REGEX_LINK:
      return {
        ...state,
        submitError: payload,
      };
    case MasterContentFormActionKind.NO_ROOM:
      return {
        ...state,
        master_room: payload,
      };
    case MasterContentFormActionKind.IS_HAS_ROOM:
      return {
        ...state,
        isHasRoom: payload,
      };
    case MasterContentFormActionKind.CHANGE_INPUT:
      return {
        ...state,
        newFeed: {
          ...state.newFeed,
          [payload.target.name]: payload.target.value,
        },
      };
  }
};

const initialState: MasterContentFormState = {
  newFeed: {
    id: null,
    title: '',
    external_link: '',
    master_room: '',
    contents: '',
    description: '',
    source: 'web',
    master: null,
    stocks: [],
    tags: [],
  },
  masters: [],
  master_room: [],
  isSubmitting: false,
  loading: false,
  error: null,
  submitError: false,
  isHasRoom: false,
};

const MasterContentFormContainer: FC<MasterFormProps> = (props) => {
  const { mode, onComplete } = props;
  const { user } = useAuth();
  const { master } = user;

  const [masterContentFormState, dispatch] = useReducer(
    MasterContentFormReducer,
    initialState,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { masterId } = useParams();
  const tagInput = useRef(null);
  const stockInput = useRef(null);

  //* 마스터 정보 불러오기
  const getMasters = async () => {
    try {
      const { data, status } = await APIMaster.getMasters(user.id);

      if (status === 200 && data.length > 0) {
        dispatch({
          type: MasterContentFormActionKind.GET_MASTER,
          payload: data,
        });
        if (data[0].master_rooms) {
          const roomData = data[0].master_rooms.filter(
            (data) => data.isDeleted === false,
          );
          if (roomData.length > 0) {
            dispatch({
              type: MasterContentFormActionKind.GET_ROOM,
              payload: roomData,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //* 채널 변경시 방 데이터 불러오기
  const handleChangeMaster = async (event: any) => {
    try {
      dispatch({
        type: MasterContentFormActionKind.CHANGE_INPUT,
        payload: event,
      });
      const masterId = Number(event.target.value);

      const { data, status } = await APIMaster.getRoomsByMaster(
        masterId,
      );
      if (status === 200 && data.length > 0) {
        dispatch({
          type: MasterContentFormActionKind.GET_ROOM,
          payload: data,
        });
      } else {
        dispatch({
          type: MasterContentFormActionKind.NO_ROOM,
          payload: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 채널 불러오는 useEffect
  useEffect(() => {
    getMasters();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [master]);

  //* 수정 시 기존 데이터 불러오기
  const getMaster = async () => {
    dispatch({ type: MasterContentFormActionKind.LOADING });
    try {
      if (masterId.toString() === '0') return;
      const { status, data } = await APIMaster.getDetailFeed(
        masterId.toString(),
      );

      if (status === 200) {
        const newMasterData = {
          id: data.id,
          title: data.title,
          contents: data.contents,
          master: data.master,
          room: data.master_room.id,
          tags: data.tags,
          stocks: data.stocks,
          external_link: data.external_link,
        };
        dispatch({
          type: MasterContentFormActionKind.GET_FEED,
          payload: newMasterData,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //* 수정 모드일 때 데이터 불러오기
  useEffect(() => {
    if (mode === 'edit') {
      getMaster();
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

  //* Submit
  const handleSubmit = async (event: any): Promise<void> => {
    event.preventDefault();
    if (masterContentFormState.submitError) {
      toast.error('내용을 다시 확인해주세요');
      return;
    }
    try {
      setIsSubmitting(true);
      if (editorRef.current) {
        console.log(masterContentFormState.newFeed);
        const contents = log();
        const newFeed = {
          ...masterContentFormState.newFeed,
          tags:
            masterContentFormState.newFeed.tags.map(
              (data) => data.id,
            ) || [],
          stocks:
            masterContentFormState.newFeed.stocks.map(
              (data) => data.id,
            ) || [],
          contents,
          master: masterContentFormState.newFeed.master,
        };
        if (mode === 'create') {
          try {
            const response = await cmsServer.post(
              '/master-feeds',
              newFeed,
            );
            if (response.status === 200) {
              if (onComplete) {
                onComplete();
              }
            } else {
              return;
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          const newFeed = {
            ...masterContentFormState.newFeed,
            tags:
              masterContentFormState.newFeed.tags.map(
                (data) => data.id,
              ) || [],
            stocks:
              masterContentFormState.newFeed.stocks.map(
                (data) => data.id,
              ) || [],
            contents,
            master: master.id,
          };
          try {
            const response = await cmsServer.put(
              `/master-feeds/${newFeed.id}`,
              newFeed,
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
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //* 링크 입력시 정규식 표현
  const handleSubmitError = (event) => {
    dispatch({
      type: MasterContentFormActionKind.CHANGE_INPUT,
      payload: event,
    });
    const regex = /^http|https/;
    if (regex.test(event.target.value)) {
      dispatch({
        type: MasterContentFormActionKind.REGEX_LINK,
        payload: false,
      });
    } else {
      dispatch({
        type: MasterContentFormActionKind.REGEX_LINK,
        payload: true,
      });
    }
    if (masterContentFormState.newFeed.external_link === '') {
      dispatch({
        type: MasterContentFormActionKind.REGEX_LINK,
        payload: false,
      });
    }
  };

  //* 태그 관련
  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList({ _q: value });
  }, [tagInput]);
  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput.current], []);
  const handleTagChange = _.debounce(refetchTag, 300);
  //* 종목 관련

  const getStockList = useCallback(() => {
    return APIStock.getSimpleList();
  }, []);
  const [{ data: stockList, loading: stockLoading }, refetchStock] =
    useAsync<any>(getStockList, [], []);
  const handleStockChange = _.debounce(refetchStock, 300);

  return (
    <MasterContentFormPresenter
      editorRef={editorRef}
      dispatch={dispatch}
      handleSubmit={handleSubmit}
      masterContentFormState={masterContentFormState}
      isSubmitting={isSubmitting}
      handleChangeMaster={handleChangeMaster}
      tagList={tagList}
      tagInput={tagInput}
      tagLoading={tagLoading}
      handleTagChange={handleTagChange}
      stockList={stockList}
      stockLoading={stockLoading}
      stockInput={stockInput}
      handleStockChange={handleStockChange}
      handleSubmitError={handleSubmitError}
    />
  );
};

export default MasterContentFormContainer;
