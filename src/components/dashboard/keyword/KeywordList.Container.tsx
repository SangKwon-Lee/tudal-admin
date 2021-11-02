import React, {
  useEffect,
  useCallback,
  useRef,
  useReducer,
} from 'react';
import toast from 'react-hot-toast';
import { IRoleType } from 'src/types/user';
import * as _ from 'lodash';
import useAsync from 'src/hooks/useAsync';
import { APITag } from 'src/lib/api';
import { ITagAlias, Tag } from 'src/types/schedule';
import useAuth from 'src/hooks/useAuth';

import { errorMessage } from 'src/common/error';
import KeywordListPresenter from './KeywordList.Presenter';

interface ISortOption {
  label: string;
  value: string;
}

const sortOptions: ISortOption[] = [
  {
    label: '기본',
    value: 'id:asc',
  },
  {
    label: '이름순',
    value: 'name:desc',
  },
  {
    label: '수정일 최신순',
    value: 'updated_at:desc',
  },
];

export interface IKeywordListStatus {
  _q: string;
  _sort: string;
  _alias: boolean;
  _start: number;
  _limit: number;
  summary_null: boolean;
  description_null: boolean;
}

export interface IKeywordListState {
  newKeyword: Tag;
  list: Tag[];
  listLength: number;
  page: number;
  loading: boolean;
  isMultiCreate: boolean;

  summary: {
    isEditing: boolean;
    target: Tag;
  };

  description: {
    isEditing: boolean;
    target: Tag;
  };

  //dialogs
  alias: {
    isEditing: boolean;
    target: Tag;
  };
  update: {
    isUpdating: boolean;
    target: Tag;
  };
  delete: {
    isDeleting: boolean;
    target: Tag;
  };
  merge: {
    isMerging: boolean;
  };

  //api params
  status: IKeywordListStatus;
}

const initialState: IKeywordListState = {
  newKeyword: null,
  list: [],
  page: 1,
  listLength: 0,
  loading: true,
  isMultiCreate: false,
  summary: {
    isEditing: false,
    target: null,
  },

  description: {
    isEditing: false,
    target: null,
  },

  // dialogs
  alias: {
    isEditing: false,
    target: null,
  },

  update: {
    isUpdating: false,
    target: null,
  },

  delete: {
    isDeleting: false,
    target: null,
  },

  merge: {
    isMerging: false,
  },

  // api params
  status: {
    _q: '',
    _sort: sortOptions[0].value,
    _alias: true,
    _start: 0,
    _limit: 25,
    summary_null: false,
    description_null: false,
  },
};

export enum KeywordActionKind {
  LOADING = 'LOADING',
  LOAD_KEYWORDS = 'LOAD_KEYWORDS',
  LOAD_COUNT = 'LOAD_COUNT',

  SET_NEW_KEYWORD = 'SET_NEW_KEYWORD',
  SET_MULTI_CREATE = 'SET_MULTI_CREATE',

  // dialogs
  HANDLE_SUMMARY_DIALOG = 'HANDLE_SUMMARY_DIALOG',
  HANDLE_DESCRIPTION_DIALOG = 'HANDLE_DESCRIPTION_DIALOG',

  // alias dialog
  HANDLE_ALIAS_DIALOG = 'HANDLE_ALIAS_DIALOG',

  // delte dialog
  SHOW_DELETE_DIALOG = 'SHOW_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',

  // update dialog
  SHOW_UPDATE_DIALOG = 'SHOW_UPDATE_DIALOG',
  CLOSE_UPDATE_DIALOG = 'CLOSE_UPDATE_DIALOG',

  // merge dialog
  SHOW_MERGE_DIALOG = 'SHOW_MERGE_DIALOG',
  CLOSE_MERGE_DIALOG = 'CLOSE_MERGE_DIALOG',

  // page / sort
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_SORT = 'CHANGE_SORT',
  CHANGE_SEARCH = 'CHANGE_SEARCH',

  SET_SUMMARY_FILTER = 'SET_SUMMARY_FILTER',
  SET_DESCRIPTION_FILTER = 'SET_DESCRIPTION_FILTER',
}

export interface IKeywordListDispatch {
  type: KeywordActionKind;
  payload?: any;
}

interface KeywordAction {
  type: KeywordActionKind;
  payload?: any;
}

const keywordListReducer = (
  state: IKeywordListState,
  action: KeywordAction,
): IKeywordListState => {
  const { type, payload } = action;

  switch (type) {
    case KeywordActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };

    case KeywordActionKind.LOAD_KEYWORDS:
      return {
        ...state,
        list: payload,
        loading: false,
      };
    case KeywordActionKind.LOAD_COUNT:
      return {
        ...state,
        listLength: payload,
      };
    case KeywordActionKind.SET_NEW_KEYWORD:
      return {
        ...state,
        newKeyword: payload,
      };
    case KeywordActionKind.SET_MULTI_CREATE:
      return {
        ...state,
        isMultiCreate: !state.isMultiCreate,
      };

    case KeywordActionKind.HANDLE_SUMMARY_DIALOG:
      return {
        ...state,
        summary: {
          isEditing: payload.isOpen,
          target: payload.target
            ? payload.target
            : state.update.target,
        },
      };
    case KeywordActionKind.HANDLE_DESCRIPTION_DIALOG:
      return {
        ...state,
        description: {
          isEditing: payload.isOpen,
          target: payload.target
            ? payload.target
            : state.update.target,
        },
      };

    case KeywordActionKind.HANDLE_ALIAS_DIALOG: {
      return {
        ...state,
        alias: {
          isEditing: payload.isEditing,
          target: payload.target ? payload.target : null,
        },
      };
    }
    case KeywordActionKind.SHOW_UPDATE_DIALOG: {
      return {
        ...state,
        update: {
          isUpdating: true,
          target: payload,
        },
      };
    }
    case KeywordActionKind.CLOSE_UPDATE_DIALOG: {
      return {
        ...state,
        update: {
          isUpdating: false,
          target: null,
        },
      };
    }
    case KeywordActionKind.SHOW_DELETE_DIALOG: {
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    }
    case KeywordActionKind.CLOSE_DELETE_DIALOG: {
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };
    }
    case KeywordActionKind.SHOW_MERGE_DIALOG: {
      return {
        ...state,
        merge: {
          isMerging: true,
        },
      };
    }
    case KeywordActionKind.CLOSE_MERGE_DIALOG: {
      return {
        ...state,
        merge: {
          isMerging: false,
        },
      };
    }
    case KeywordActionKind.CHANGE_PAGE: {
      return {
        ...state,
        page: payload,
        status: {
          ...state.status,
          _start: payload * state.status._limit,
        },
      };
    }
    case KeywordActionKind.CHANGE_SORT: {
      return {
        ...state,
        status: {
          ...state.status,
          _sort: payload,
        },
      };
    }
    case KeywordActionKind.CHANGE_SEARCH: {
      return {
        ...state,
        page: 1,
        status: {
          ...state.status,
          _q: payload,
          _start: 0,
        },
      };
    }
    case KeywordActionKind.SET_SUMMARY_FILTER: {
      return {
        ...state,
        status: {
          ...state.status,
          summary_null: state.status.summary_null ? false : true,
        },
      };
    }
    case KeywordActionKind.SET_DESCRIPTION_FILTER: {
      return {
        ...state,
        status: {
          ...state.status,
          description_null: state.status.description_null
            ? false
            : true,
        },
      };
    }
  }
};

interface IKeywordListContainerProps {
  pageTopRef: React.RefObject<HTMLDivElement>;
}
const KeywordListContainer: React.FC<IKeywordListContainerProps> = (
  props,
) => {
  const { user } = useAuth();
  const { pageTopRef } = props;
  const tagAddInputRef = useRef<HTMLInputElement>(null);
  const multiTagInputRef = useRef<HTMLTextAreaElement>(null);
  const [tagListState, dispatch] = useReducer(
    keywordListReducer,
    initialState,
  );

  const getList = useCallback(
    async (scrollToTop = true) => {
      dispatch({ type: KeywordActionKind.LOADING });
      try {
        const { data, status } = await APITag.getList(
          tagListState.status,
        );
        if (status === 200) {
          dispatch({
            type: KeywordActionKind.LOAD_KEYWORDS,
            payload: data,
          });
          scrollToTop &&
            pageTopRef?.current.scrollIntoView({
              behavior: 'smooth',
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [tagListState.status, pageTopRef],
  );

  const getListCount = useCallback(async () => {
    try {
      const { _alias, ...query } = tagListState.status;
      const { data, status } = await APITag.getListCount(query);
      if (status === 200) {
        dispatch({
          type: KeywordActionKind.LOAD_COUNT,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [tagListState.status]);

  const postKeyword = async () => {
    dispatch({ type: KeywordActionKind.LOADING });
    try {
      if (!tagListState.newKeyword) {
        toast.error('입력해주세요.');
        return;
      }

      const value = tagListState.newKeyword.inputValue;
      const { status } = await APITag.postItem(value);
      if (status === 200) {
        toast.success('추가되었습니다.');
        dispatch({
          type: KeywordActionKind.CHANGE_SEARCH,
          payload: '',
        });
        dispatch({
          type: KeywordActionKind.SET_NEW_KEYWORD,
          payload: null,
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const postMultiKeywords = async () => {
    dispatch({ type: KeywordActionKind.LOADING });

    try {
      if (!multiTagInputRef.current.value) {
        toast.error('키워드를 확인해 주세요');
        return;
      }
      const values = multiTagInputRef.current.value.split('\n');

      const success = [];
      const errors = [];
      for (let i = 0; i < values.length; i++) {
        const { data, status } = await APITag.postItem(values[i]);
        if (status === 200 && Boolean(data)) {
          success.push(data.name);
        } else {
          errors.push(values[i]);
        }
      }
      success.forEach((success) => toast.success(success));
      errors.forEach((error) => toast.error(error));
      multiTagInputRef.current.value = '';
    } catch (error) {
      toast.error('키워드를 다시 확인해주세요');
    }
  };

  const updateKeyword = async (id, body) => {
    try {
      if (body && body.name) {
        const { status, data } = await APITag.find(body.name);
        if (status !== 200) {
          toast.error(errorMessage.TEMP_SERVER_ERROR);
          return;
        }
        if (!_.isEmpty(data)) {
          toast.error('중복된 키워드가 있습니다');
          return;
        }
      }
      const { status } = await APITag.update(id, body);
      if (status === 200) {
        dispatch({ type: KeywordActionKind.CLOSE_UPDATE_DIALOG });
        getList(false);
      } else {
        toast.error('업데이트에 실패하였습니다');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteKeyword = async () => {
    try {
      if (user.role.type !== IRoleType.AUTHENTICATED) {
        toast.error('삭제는 관리자 권한이 필요합니다.');
      } else {
        const { target } = tagListState.delete;
        const { status, data } = await APITag.update(target.id, {
          isDeleted: !target.isDeleted,
        });
        if (status === 200) {
          toast.success(
            data.isDeleted ? '삭제되었습니다.' : '복구되었습니다.',
          );
          getList(false);
        } else {
          toast.error('요청이 실패하였습니다');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: KeywordActionKind.CLOSE_DELETE_DIALOG });
    }
  };

  const createAlias = async (name: string) => {
    try {
      const { target } = tagListState.alias;
      const { status } = await APITag.postAlias(target.id, name);
      if (status === 200) {
        toast.success('alias 추가에 성공했습니다.');
        dispatch({
          type: KeywordActionKind.HANDLE_ALIAS_DIALOG,
          payload: { isEditing: false },
        });
        getList(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAlias = async (alias: ITagAlias) => {
    try {
      const { status } = await APITag.removeAlias(alias.id);
      if (status === 200) {
        toast.success(
          `${alias.aliasName}이(가) 성공적으로 삭제되었습니다.`,
        );
        dispatch({
          type: KeywordActionKind.HANDLE_ALIAS_DIALOG,
          payload: { isEditing: false },
        });
        getList(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    getListCount();
  }, [getListCount]);

  const [keywordAutocomplete, refetchKeywordAutocomplete] = useAsync<
    Tag[]
  >(
    () => APITag.search({ _q: tagAddInputRef.current?.value }),
    [],
    [],
  );

  return (
    <KeywordListPresenter
      dispatch={dispatch}
      reload={getList}
      state={tagListState}
      postKeyword={postKeyword}
      postMultiKeywords={postMultiKeywords}
      tagAddInputRef={tagAddInputRef}
      multiTagInputRef={multiTagInputRef}
      keywordAutocomplete={keywordAutocomplete}
      refetchKeywordAutocomplete={refetchKeywordAutocomplete}
      createAlias={createAlias}
      deleteAlias={deleteAlias}
      updateKeyword={updateKeyword}
      deleteKeyword={deleteKeyword}
    />
  );
};

export default KeywordListContainer;
