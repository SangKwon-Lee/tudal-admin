import React, { useEffect, useCallback, useReducer } from 'react';
import toast from 'react-hot-toast';
import { APISchedule } from 'src/lib/api';
import { AxiosError } from 'axios';

import { Schedule } from '../../../types/schedule';
import { ScheduleListPresenter } from '.';

export enum ScheduleActionKind {
  LOADING = 'LOADING',
  ADD_SCHEDULE = 'ADD_SCHEDULE',
  LOAD_SCHEDULE = 'LOAD_SCHEDULE',
  LOAD_COUNT = 'LOAD_COUNT',
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
  _sort: any;
  _page: number;
  _limit: number;
  _startDate: string;
  _endDate: string;
}
export interface IScheduleListState {
  list: Schedule[];
  listLength: number;
  loading: boolean;
  isOpenConfirm: boolean;
  error: AxiosError<any> | boolean;

  delete: {
    isDeleting: boolean;
    target: Schedule;
  };
  status: IScheduleListStatus;
}

const initialState: IScheduleListState = {
  list: [],
  listLength: 0,
  delete: { isDeleting: false, target: null },
  loading: true,
  error: null,
  isOpenConfirm: false,
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
    case ScheduleActionKind.LOAD_COUNT:
      return {
        ...state,
        listLength: payload,
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
  pageTopRef: React.RefObject<HTMLDivElement>;
  shouldUpdate: boolean;
  handleUpdate: (shouldUpdate: boolean) => void;
  setTargetModify: (target: Schedule) => void;
}

const ScheduleListTable: React.FC<ScheduleListTableProps> = (
  props,
) => {
  const { shouldUpdate, handleUpdate, setTargetModify, pageTopRef } =
    props;
  const [scheduleListState, dispatch] = useReducer(
    scheduleReducer,
    initialState,
  );

  const { status } = scheduleListState;

  const getSchedule = useCallback(
    async (scrollTop = true) => {
      dispatch({ type: ScheduleActionKind.LOADING });

      try {
        const { data } = await APISchedule.getList(status);

        dispatch({
          type: ScheduleActionKind.LOAD_SCHEDULE,
          payload: data,
        });
        scrollTop &&
          pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    },
    [pageTopRef, status],
  );

  const getListCount = useCallback(async () => {
    dispatch({ type: ScheduleActionKind.LOADING });

    try {
      const { data } = await APISchedule.getTotalCount();
      dispatch({
        type: ScheduleActionKind.LOAD_COUNT,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const postDelete = async () => {
    try {
      const { target } = scheduleListState.delete;
      if (!target) {
        toast.error('에러가 발생했습니다.');
        return;
      }
      const { status } = await APISchedule.deleteItem(target.id);
      if (status === 200) {
        dispatch({ type: ScheduleActionKind.CLOSE_DELETE_DIALOG });
        toast.success('삭제되었습니다');
        getSchedule(false);
      }
    } catch (error) {
      toast.error(
        '삭제에 실패했습니다. 관리자에게 문의해주시길 바랍니다.',
      );
    }
  };

  useEffect(() => {
    getSchedule();
    getListCount();
  }, [getSchedule, getListCount]);

  useEffect(() => {
    shouldUpdate && getSchedule();
    handleUpdate(false);
  }, [shouldUpdate, getSchedule, handleUpdate]);

  return (
    <ScheduleListPresenter
      state={scheduleListState}
      dispatch={dispatch}
      sortOptions={sortOptions}
      postDelete={postDelete}
      setTargetModify={setTargetModify}
    />
  );
};

export default ScheduleListTable;
