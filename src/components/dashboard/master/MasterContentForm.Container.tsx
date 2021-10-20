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
import { Room, Master, Channel } from 'src/types/master';
import useAsync from 'src/hooks/useAsync';
import { Tag } from 'src/types/schedule';
import { APIMaster, APIStock, APITag } from 'src/lib/api';
import _ from 'lodash';
import toast from 'react-hot-toast';

interface MasterFormProps {
  onComplete?: () => void;
  mode: string;
}

export enum MasterContentFormActionKind {
  LOADING = 'LOADING',
  ERROR = 'ERROR',

  // Load APIS
  GET_EXPERT = 'GET_EXPERT',
  GET_CHANNEL = 'GET_CHANNEL',
  GET_ROOM = 'GET_ROOM',
  // Changes
  NO_ROOM = 'NO_ROOM',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_ROOM = 'CHANGE_ROOM',
  CHANGE_LINK = 'CHANGE_LINK',
  CHANGE_TAGS = 'CHANGE_TAGS',
  CHANGE_STOCKS = 'CHANGE_STOCKS',
  CHANGE_CHANNEL = 'CHANGE_CHANNEL',
  REGEX_LINK = 'REGEX_LINK',
  IS_HAS_ROOM = 'IS_HAS_ROOM',
}
export interface MasterContentFormAction {
  type: MasterContentFormActionKind;
  payload?: any;
}

export interface MasterContentFormState {
  newMaster: Master;
  loading: boolean;
  error: AxiosError<any> | boolean;
  isSubmitting: boolean;
  master_room: Room[];
  master_channels: Channel[];
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
    case MasterContentFormActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
    case MasterContentFormActionKind.GET_EXPERT:
      return {
        ...state,
        newMaster: payload,
        loading: false,
      };
    case MasterContentFormActionKind.GET_ROOM:
      return {
        ...state,
        master_room: payload,
        newMaster: {
          ...state.newMaster,
          master_room: payload[0].id,
        },
      };
    case MasterContentFormActionKind.CHANGE_TITLE:
      return {
        ...state,
        newMaster: {
          ...state.newMaster,
          title: payload,
        },
      };
    case MasterContentFormActionKind.CHANGE_ROOM:
      return {
        ...state,
        newMaster: {
          ...state.newMaster,
          master_room: payload,
        },
      };
    case MasterContentFormActionKind.CHANGE_LINK:
      return {
        ...state,
        newMaster: {
          ...state.newMaster,
          external_link: payload,
        },
      };
    case MasterContentFormActionKind.CHANGE_TAGS:
      return {
        ...state,
        newMaster: {
          ...state.newMaster,
          tags: payload,
        },
      };
    case MasterContentFormActionKind.CHANGE_STOCKS:
      return {
        ...state,
        newMaster: {
          ...state.newMaster,
          stocks: payload,
        },
      };
    case MasterContentFormActionKind.GET_CHANNEL:
      return {
        ...state,
        master_channels: payload,
      };
    case MasterContentFormActionKind.CHANGE_CHANNEL:
      return {
        ...state,
        master_room: payload,
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
  }
};

const MasterContentFormContainer: FC<MasterFormProps> = (props) => {
  const { mode, onComplete } = props;
  const { user } = useAuth();
  const initialState: MasterContentFormState = {
    newMaster: {
      title: '',
      external_link: '',
      master_room: '',
      contents: '',
      author: user?.id,
      source: 'web',
      master: user?.id,
      stocks: [],
      tags: [],
    },
    master_channels: [],
    master_room: [],
    isSubmitting: false,
    loading: false,
    error: null,
    submitError: false,
    isHasRoom: false,
  };
  const [masterContentFormState, dispatch] = useReducer(
    MasterContentFormReducer,
    initialState,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { masterId } = useParams();
  const tagInput = useRef(null);
  const stockInput = useRef(null);

  const getMasterRoom = async () => {
    const { data } = await cmsServer.get(
      `/master-channels?master.id=${user.id}`,
    );
    const { data: roomData } = await cmsServer.get(
      `/master-rooms?master.id=${user.id}&isDeleted=0`,
    );
    if (data.length === 0 || roomData.length === 0) {
      dispatch({
        type: MasterContentFormActionKind.IS_HAS_ROOM,
        payload: true,
      });
    } else {
      dispatch({
        type: MasterContentFormActionKind.IS_HAS_ROOM,
        payload: false,
      });
    }
  };

  //* 채널 정보 불러오기
  const getMasterChannel = async () => {
    try {
      const { data, status } = await APIMaster.getMasterChannel(
        user.id,
      );
      if (status === 200 && data.length > 0) {
        dispatch({
          type: MasterContentFormActionKind.GET_CHANNEL,
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
  const handleChangeChannel = async (event: any) => {
    try {
      const { data, status } = await APIMaster.getMasterRoom(
        Number(event.target.value),
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
    getMasterChannel();
    getMasterRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
          author: data.author,
          room: data.master_room.id,
          tags: data.tags,
          stocks: data.stocks,
          external_link: data.external_link,
        };
        dispatch({
          type: MasterContentFormActionKind.GET_EXPERT,
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
        const contents = log();
        const newMaster = {
          ...masterContentFormState.newMaster,
          tags:
            masterContentFormState.newMaster.tags.map(
              (data) => data.id,
            ) || [],
          stocks:
            masterContentFormState.newMaster.stocks.map(
              (data) => data.id,
            ) || [],
          contents,
        };
        if (mode === 'create') {
          try {
            const response = await cmsServer.post(
              '/master-feeds',
              newMaster,
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
          const newMaster = {
            ...masterContentFormState.newMaster,
            tags:
              masterContentFormState.newMaster.tags.map(
                (data) => data.id,
              ) || [],
            stocks:
              masterContentFormState.newMaster.stocks.map(
                (data) => data.id,
              ) || [],
            contents,
          };
          try {
            const response = await cmsServer.put(
              `/master-feeds/${newMaster.id}`,
              newMaster,
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
      type: MasterContentFormActionKind.CHANGE_LINK,
      payload: event.target.value,
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
    if (masterContentFormState.newMaster.external_link === '') {
      dispatch({
        type: MasterContentFormActionKind.REGEX_LINK,
        payload: false,
      });
    }
  };

  //* 태그 관련
  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
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
      handleChangeChannel={handleChangeChannel}
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
