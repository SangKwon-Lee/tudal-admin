import {
  useState,
  useRef,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import type { FC, FormEvent } from 'react';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { cmsServer } from '../../../lib/axios';
import MasterContentFormPresenter from './MasterContentForm.Presenter';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';
import { useParams } from 'react-router-dom';
import { Channel, Master, Room } from 'src/types/expert';
import useAsync from 'src/hooks/useAsync';
import { Tag } from 'src/types/schedule';
import { APIStock, APITag } from 'src/lib/api';
import _ from 'lodash';

interface MasterFormProps {
  onComplete?: () => void;
  mode: string;
}

enum MasterContentFormActionKind {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  GET_EXPERT = 'GET_EXPERT',
  GET_CHANNEL = 'GET_CHANNEL',
  CHANGE_TITLE = 'CHANGE_TITLE',
  CHANGE_ROOM = 'CHANGE_ROOM',
  CHANGE_LINK = 'CHANGE_LINK',
  CHANGE_TAGS = 'CHANGE_TAGS',
  CHANGE_STOCKS = 'CHANGE_STOCKS',
  CHANGE_CHANNEL = 'CHANGE_CHANNEL',
}
interface MasterContentFormAction {
  type: MasterContentFormActionKind;
  payload?: any;
}

interface newState {
  newMaster: Master;
  loading: boolean;
  error: AxiosError<any> | boolean;
  isSubmitting: boolean;
  master_room: Room[];
  master_channels: Channel[];
}

const MasterContentFormReducer = (
  state: newState,
  action: MasterContentFormAction,
): newState => {
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
        master_room: payload[0].master_rooms,
        newMaster: {
          ...state.newMaster,
          master_room: payload[0].master_rooms[0].id,
        },
      };
    case MasterContentFormActionKind.CHANGE_CHANNEL:
      return {
        ...state,
        master_room: payload,
      };
  }
};

const MasterContentFormContainer: FC<MasterFormProps> = (props) => {
  const { mode, onComplete } = props;
  const { user } = useAuth();
  const initialState: newState = {
    newMaster: {
      title: '',
      external_link: '',
      master_room: '',
      description: '',
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
  };
  const [newState, dispatch] = useReducer(
    MasterContentFormReducer,
    initialState,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { masterId } = useParams();
  const tagInput = useRef(null);
  const stockInput = useRef(null);

  //* 채널 정보 불러오기
  const getMasterChannel = async () => {
    try {
      const response = await cmsServer.get(
        `/master-channels?master.id=${user.id}`,
      );
      if (response.status === 200 && response.data.length > 0) {
        dispatch({
          type: MasterContentFormActionKind.GET_CHANNEL,
          payload: response.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangeChannel = async (event: any) => {
    try {
      const response = await cmsServer.get(
        `master-channels?id=${event.target.value}`,
      );
      if (
        response.status === 200 &&
        response.data[0].master_rooms.length > 0
      ) {
        dispatch({
          type: MasterContentFormActionKind.CHANGE_CHANNEL,
          payload: response.data[0].master_rooms,
        });
        dispatch({
          type: MasterContentFormActionKind.CHANGE_ROOM,
          payload: response.data[0].master_rooms[0].id,
        });
      } else {
        dispatch({
          type: MasterContentFormActionKind.CHANGE_CHANNEL,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //* 수정 시 기존 데이터 불러오기
  const getMaster = async () => {
    dispatch({ type: MasterContentFormActionKind.LOADING });
    try {
      if (masterId.toString() === '0') return;
      const { status, data } = await cmsServer.get<Master>(
        `/master-feeds/${masterId.toString()}`,
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
      const { status, data } = await cmsServer.get<Master>(
        `/expert-feeds/${masterId.toString()}`,
      );
      if (status === 200) {
        const newMasterData = {
          id: data.id,
          title: data.title,
          description: data.description,
          contents: data.description,
          author: data.author,
        };
        dispatch({
          type: MasterContentFormActionKind.GET_EXPERT,
          payload: newMasterData,
        });
      }
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
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      if (editorRef.current) {
        const contents = log();
        const newMaster = {
          ...newState.newMaster,
          tags: newState.newMaster.tags.map((data) => data.id) || [],
          stocks:
            newState.newMaster.stocks.map((data) => data.id) || [],
          contents,
          isDeleted: 0,
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
            const response = await cmsServer.post(
              '/expert-feeds',
              newMaster,
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
          const newMaster = {
            ...newState.newMaster,
            tags:
              newState.newMaster.tags.map((data) => data.id) || [],
            stocks:
              newState.newMaster.stocks.map((data) => data.id) || [],
            contents,
            isDeleted: 0,
          };
          if (!newState.newMaster.description) {
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
          } else {
            const newMaster = {
              ...newState.newMaster,
              description: contents,
            };
            try {
              const response = await cmsServer.put(
                `/expert-feeds/${newMaster.id}`,
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
              dispatch({
                type: MasterContentFormActionKind.ERROR,
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
      type: MasterContentFormActionKind.CHANGE_TITLE,
      payload: event.target.value,
    });
  };

  //* 방 변경
  const handleChangeRoom = (event: any): void => {
    dispatch({
      type: MasterContentFormActionKind.CHANGE_ROOM,
      payload: event.target.value,
    });
  };

  //* 링크 변경
  const handleChangeLink = (event: any): void => {
    dispatch({
      type: MasterContentFormActionKind.CHANGE_LINK,
      payload: event.target.value,
    });
  };

  //* 태그 관련
  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
  }, [tagInput]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput.current], []);

  const handleChangeTags = (item): void => {
    dispatch({
      type: MasterContentFormActionKind.CHANGE_TAGS,
      payload: item,
    });
  };
  const handleTagChange = _.debounce(refetchTag, 300);

  //* 종목 관련
  const getStockList = useCallback(() => {
    return APIStock.getSimpleList();
  }, []);

  const [{ data: stockList, loading: stockLoading }, refetchStock] =
    useAsync<any>(getStockList, [], []);

  const handleChangeStocks = (item): void => {
    dispatch({
      type: MasterContentFormActionKind.CHANGE_STOCKS,
      payload: item,
    });
  };
  const handleStockChange = _.debounce(refetchStock, 300);

  return (
    <MasterContentFormPresenter
      handleChangeTitle={handleChangeTitle}
      editorRef={editorRef}
      handleSubmit={handleSubmit}
      newState={newState}
      isSubmitting={isSubmitting}
      handleChangeRoom={handleChangeRoom}
      handleChangeLink={handleChangeLink}
      tagList={tagList}
      tagInput={tagInput}
      tagLoading={tagLoading}
      handleChangeTags={handleChangeTags}
      handleTagChange={handleTagChange}
      stockList={stockList}
      stockLoading={stockLoading}
      stockInput={stockInput}
      handleStockChange={handleStockChange}
      handleChangeStocks={handleChangeStocks}
      handleChangeChannel={handleChangeChannel}
    />
  );
};

export default MasterContentFormContainer;
