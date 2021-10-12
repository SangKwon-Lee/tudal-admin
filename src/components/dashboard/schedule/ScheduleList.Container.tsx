import React, {
  ChangeEvent,
  useState,
  RefObject,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { APISchedule } from 'src/lib/api';
import { AxiosError } from 'axios';

import Label from '../../widgets/Label';
import { Schedule } from '../../../types/schedule';
import { ScheduleListPresenter } from '.';

import useMounted from 'src/hooks/useMounted';
import * as _ from 'lodash';

export enum ScheduleActionKind {
  LOADING = 'LOADING',
  ADD_SCHEDULE = 'ADD_SCHEDULE',
  LOAD_SCHEDULE = 'LOAD_SCHEDULE',
  SHOW_SELECT_CONFIRM = 'SHOW_SELECT_CONFIRM',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',
  ERROR = 'ERROR',

  // delte
  SHOW_DELETE_DIALOG = 'SHOW_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',

  // page / sort
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_SORT = 'CHANGE_SORT',
  CHANGE_SEARCH = 'CHANGE_SEARCH',
  CHANGE_STARTDATE = 'CHANGE_STARTDATE',
  CHANGE_ENDDATE = 'CHANGE_ENDDATE',
}

export interface IScheduleListDispatch {
  type: ScheduleActionKind;
  payload?: any;
}

interface ScheduleAction {
  type: ScheduleActionKind;
  payload?: any;
}

type Sort =
  | 'created_at:desc'
  | 'created_at:asc'
  | 'startDate:desc'
  | 'startDate:asc'
  | 'author:desc'
  | 'priority:desc';

interface SortOption {
  value: Sort;
  label: string;
}
const sortOptions: SortOption[] = [
  {
    label: '최신 등록순',
    value: 'created_at:desc',
  },
  {
    label: '오래된 등록순',
    value: 'created_at:asc',
  },
  {
    label: '시작일자 내림차순',
    value: 'startDate:desc',
  },
  {
    label: '시작일자 오름차순',
    value: 'startDate:asc',
  },
  {
    label: '작성자 내림차순',
    value: 'author:desc',
  },
  {
    label: '중요도 내림차순',
    value: 'priority:desc',
  },
];

export interface IScheduleListStatus {
  _q: string;
  _sort: Sort;
  _page: number;
  _limit: number;
  _startDate: string;
  _endDate: string;
}
export interface IScheduleListState {
  list: Schedule[];
  loading: boolean;
  isOpenConfirm: boolean;
  error: AxiosError<any> | boolean;
  page: number;
  delete: {
    isDeleting: boolean;
    target: Schedule;
  };
  status: IScheduleListStatus;
}

const rowsPerPage = 50;
const initialState: IScheduleListState = {
  list: [],
  delete: { isDeleting: false, target: null },
  loading: true,
  error: null,
  isOpenConfirm: false,
  page: 0,

  status: {
    _q: '',
    _sort: sortOptions[0].value,
    _page: 1,
    _limit: 50,
    _startDate: '',
    _endDate: '',
  },
};

const scheduleReducer = (
  state: IScheduleListState,
  action: ScheduleAction,
): IScheduleListState => {
  const { type, payload } = action;

  switch (type) {
    case ScheduleActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ScheduleActionKind.LOAD_SCHEDULE:
      return {
        ...state,
        loading: false,
        list: payload,
      };

    case ScheduleActionKind.ADD_SCHEDULE:
      return {
        ...state,
        loading: false,
        list: [...state.list, ...payload],
        status: {
          ...state.status,
        },
      };
    case ScheduleActionKind.SHOW_SELECT_CONFIRM:
      return {
        ...state,
        isOpenConfirm: true,
      };
    case ScheduleActionKind.CLOSE_SELECT_CONFIRM:
      return {
        ...state,
        isOpenConfirm: false,
      };

    case ScheduleActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };

    case ScheduleActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        status: {
          ...state.status,
          _page: payload,
        },
      };

    case ScheduleActionKind.CHANGE_SEARCH:
      return {
        ...state,
        status: { ...state.status, _q: payload },
      };

    case ScheduleActionKind.CHANGE_STARTDATE:
      return {
        ...state,
        status: { ...state.status, _startDate: payload },
      };
    case ScheduleActionKind.CHANGE_ENDDATE:
      return {
        ...state,
        status: { ...state.status, _endDate: payload },
      };
    case ScheduleActionKind.CHANGE_SORT:
      return {
        ...state,
        status: { ...state.status, _sort: payload },
      };

    case ScheduleActionKind.SHOW_DELETE_DIALOG:
      return {
        ...state,
        delete: { isDeleting: true, target: payload },
      };
    case ScheduleActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: { isDeleting: false, target: null },
      };
  }
};

interface ScheduleListTableProps {
  shouldUpdate: boolean;
  setTargetModify: (target: Schedule) => void;
  setShouldUpdate: (value: boolean) => void;
}

const ScheduleListTable: React.FC<ScheduleListTableProps> = (
  props,
) => {
  const mounted = useMounted();
  const { shouldUpdate, setShouldUpdate, setTargetModify } = props;
  const [scheduleListState, dispatch] = useReducer(
    scheduleReducer,
    initialState,
  );

  const { list, page, status } = scheduleListState;

  const getSchedule = useCallback(
    async (reload = false) => {
      dispatch({ type: ScheduleActionKind.LOADING });

      try {
        const { data } = await APISchedule.getList(status);

        dispatch({
          type: ScheduleActionKind.LOAD_SCHEDULE,
          payload: data,
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: ScheduleActionKind.ERROR, payload: error });
      }
    },
    [status],
  );

  const postDelete = async (id: number) => {
    try {
      const { status } = await APISchedule.deleteItem(id);
      if (status === 200) {
        dispatch({ type: ScheduleActionKind.CLOSE_DELETE_DIALOG });

        toast.success('삭제되었습니다');
      }
    } catch (error) {
      toast.error(
        '삭제에 실패했습니다. 관리자에게 문의해주시길 바랍니다.',
      );
    }
  };

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  return (
    <ScheduleListPresenter
      state={scheduleListState}
      dispatch={dispatch}
      sortOptions={sortOptions}
      postDelete={postDelete}
      setShouldUpdate={setShouldUpdate}
      setTargetModify={setTargetModify}
    />
  );
};

export default ScheduleListTable;
