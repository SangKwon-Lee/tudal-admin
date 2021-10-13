import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
  useReducer,
} from 'react';
import { applyPagination } from 'src/utils/pagination';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import dayjs from 'dayjs';

import {
  FormLabel,
  Checkbox,
  Tooltip,
  Box,
  Container,
  Breadcrumbs,
  Grid,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Autocomplete,
  TextField,
  Typography,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Dialog,
  Collapse,
} from '@material-ui/core';

import useSettings from 'src/hooks/useSettings';
import toast, { Toaster } from 'react-hot-toast';
import Scrollbar from '../../components/layout/Scrollbar';
import ChevronRightIcon from 'src/icons/ChevronRight';
import { IRoleType } from 'src/types/user';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import * as _ from 'lodash';
import ArrowRightIcon from 'src/icons/ArrowRight';
import useAsync from 'src/hooks/useAsync';
import PencilAltIcon from 'src/icons/PencilAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import BuildIcon from '@material-ui/icons/Build';
import AliasIcon from '@material-ui/icons/Repeat';
import SearchIcon from '../../icons/Search';
import { APITag } from 'src/lib/api';
import { ITagAlias, Tag } from 'src/types/schedule';
import useAuth from 'src/hooks/useAuth';

import KeywordEditDialog from 'src/components/dashboard/keyword/KeywordEditDialog';
import EditTextDialog from 'src/components/dialogs/Dialog.EditText';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import DialogEditMultiSelect from 'src/components/dialogs/Dialog.EditMultiSelect';
import Label from 'src/components/widgets/Label';
import { errorMessage } from 'src/common/error';
import { isStringEmpty } from 'src/utils/funcs';
import KeywordListComponent from './KeywordList.Component';

const customFilter = createFilterOptions<any>();
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

const filterOptions = [
  {
    label: '요약문',
    name: 'summary_null',
    value: false,
  },
  {
    label: '설명문',
    name: 'description_null',
    value: false,
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
  isOpenSummaryDialog: boolean;
  isOpenDescriptionDialog: boolean;

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
  isOpenSummaryDialog: false,
  isOpenDescriptionDialog: false,

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

  // api params
  status: {
    _q: '',
    _sort: '',
    _alias: false,
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
  SHOW_ALIAS_DIALOG = 'SHOW_ALIAS_DIALOG',
  CLOSE_ALIAS_DIALOG = 'CLOSE_ALIAS_DIALOG',

  // delte dialog
  SHOW_DELETE_DIALOG = 'SHOW_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',

  // update dialog
  SHOW_UPDATE_DIALOG = 'SHOW_UPDATE_DIALOG',
  CLOSE_UPDATE_DIALOG = 'CLOSE_UPDATE_DIALOG',

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
        isOpenSummaryDialog: !state.isOpenSummaryDialog,
      };
    case KeywordActionKind.HANDLE_DESCRIPTION_DIALOG:
      return {
        ...state,
        isOpenDescriptionDialog: !state.isOpenDescriptionDialog,
      };

    case KeywordActionKind.SHOW_ALIAS_DIALOG: {
      return {
        ...state,
        alias: {
          isEditing: true,
          target: payload,
        },
      };
    }
    case KeywordActionKind.CLOSE_ALIAS_DIALOG: {
      return {
        ...state,
        alias: {
          isEditing: false,
          target: null,
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
    case KeywordActionKind.CHANGE_PAGE: {
      return {
        ...state,
        page: payload,
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
        status: {
          ...state.status,
          _q: payload,
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

const Keywords: React.FC = () => {
  const { user } = useAuth();
  const multiTagInputRef = useRef<HTMLTextAreaElement>(null);
  const [tagListState, dispatch] = useReducer(
    keywordListReducer,
    initialState,
  );

  const handleTagInput = _.debounce(refetchTag, 300);

  const getList = useCallback(async () => {
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
      }
    } catch (error) {
      console.log(error);
    }
  }, [tagListState.status]);

  const getListCount = useCallback(async () => {
    try {
      const { data, status } = await APITag.getListCount();
      if (status === 200) {
        dispatch({
          type: KeywordActionKind.LOAD_COUNT,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const postKeyword = async () => {
    dispatch({ type: KeywordActionKind.LOADING });
    try {
      if (!tagListState.newKeyword) {
        toast.error('입력해주세요.');
        return;
      }
      if (!tagListState.newKeyword.isNew) {
        toast.error('이미 등록된 키워드입니다.');
        return;
      }
      const value = tagListState.newKeyword.inputValue;
      const { status, data } = await APITag.postItem(value);
      if (status === 200) {
        toast.success('추가되었습니다.');
        dispatch({
          type: KeywordActionKind.CHANGE_SEARCH,
          payload: '',
        });
        dispatch({
          type: KeywordActionKind.SET_NEW_KEYWORD,
          payload: '',
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const postMultiKeywords = async () => {
    dispatch({ type: KeywordActionKind.LOADING });

    try {
      if (!tagCreateRef.current.value) {
        toast.error('키워드를 확인해 주세요');
        return;
      }
      const values = tagCreateRef.current.value.split('\n');

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
      tagCreateRef.current.value = '';
    } catch (error) {
      toast.error('키워드를 다시 확인해주세요');
    }
  };

  const updateTag = async (id, body) => {
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
      const { status, data } = await APITag.update(id, body);
      if (status === 200) {
        dispatch({ type: KeywordActionKind.CLOSE_UPDATE_DIALOG });
      } else {
        toast.error('업데이트에 실패하였습니다');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTag = async (tag: Tag) => {
    try {
      if (user.role.type !== IRoleType.AUTHENTICATED) {
        toast.error('삭제는 관리자 권한이 필요합니다.');
      } else {
        const { status, data } = await APITag.update(tag.id, {
          isDeleted: !tag.isDeleted,
        });
        if (status === 200) {
          toast.success(
            data.isDeleted ? '삭제되었습니다.' : '복구되었습니다.',
          );
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
      const { data, status } = await APITag.postAlias(
        target.id,
        name,
      );
      if (status === 200) {
        toast.success('alias 추가에 성공했습니다.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAlias = async (alias: ITagAlias) => {
    try {
      const { data, status } = await APITag.removeAlias(alias.id);
      if (status === 200) {
        toast.success(
          `${alias.aliasName}이(가) 성공적으로 삭제되었습니다.`,
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getList();
  }, [getList]);

  const [keywordAutocomplete, refetchKeywordAutocomplete] = useAsync<
    Tag[]
  >(getList, [tagListState.status._q], []);

  return (
    <KeywordListComponent
      postKeyword={postKeyword}
      postMultiKeywords={postMultiKeywords}
      multiTagInputRef={multiTagInputRef}
      keywordAutocomplete={keywordAutocomplete}
      refetchKeywordAutocomplete={refetchKeywordAutocomplete}
    />
  );
};

export default Keywords;
