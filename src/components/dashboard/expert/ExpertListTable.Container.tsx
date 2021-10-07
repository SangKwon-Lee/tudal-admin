import { useCallback, useEffect, useReducer, useState } from 'react';
import type { ChangeEvent } from 'react';
import { cmsServer } from '../../../lib/axios';
import {
  applyFilters,
  applyPagination,
  applySort,
} from '../../../utils/sort';
import { APIExpert } from 'src/lib/api';
import ExpertListTablePresenter from './ExpertListTable.Presenter';
import useMounted from 'src/hooks/useMounted';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';

// 감싼 컴포넌트에 React.forwardRef를 사용해 ref를 제공해주면 된다.
// const Bar = forwardRef((props: any, ref: any) => (
//   <div {...props} ref={ref}>
//     {props.children}
//   </div>
// ));

// 정렬 로직
type Sort =
  | 'updated_at|desc'
  | 'updated_at|asc'
  | 'likes|desc'
  | 'likes|asc'
  | 'viewCount|desc'
  | 'viewCount|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const sortOptions: SortOption[] = [
  {
    label: '최신순',
    value: 'updated_at|desc',
  },
  {
    label: '오래된순',
    value: 'updated_at|asc',
  },
  {
    label: '좋아요 높은순',
    value: 'likes|desc',
  },
  {
    label: '좋아요 낮은순',
    value: 'likes|asc',
  },
  {
    label: '조회수 높은순',
    value: 'viewCount|desc',
  },
  {
    label: '조회수 낮은순',
    value: 'viewCount|asc',
  },
];

enum ExpertListTableActionKind {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  GET_EXPERTS = 'GET_EXPERTS',
  CONFIRM_MODAL_OPEN = 'CONFIRM_MODAL_OPEN',
  DELETE_EXPERT = 'DELETE_EXPERT',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_SORT = 'CHANGE_SORT',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  CHANGE_ROOM = 'CHANGE_ROOM',
  SELECT_ONE_EXPERT = 'SELECT_ONE_EXPERT',
  CONFIRM_MODAL_CLOSE = 'CONFIRM_MODAL_CLOSE',
}

interface ExpertListTableAction {
  type: ExpertListTableActionKind;
  payload?: any;
}

interface newState {
  experts: any;
  page: number;
  limit: number;
  query: string;
  open: boolean;
  sort: Sort;
  selectedExperts: number[];
  loading: boolean;
  error: AxiosError<any> | boolean;
  roomSort: any;
}

const ExpertListTableReducer = (
  state: newState,
  action: ExpertListTableAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case ExpertListTableActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ExpertListTableActionKind.GET_EXPERTS:
      return {
        ...state,
        experts: payload,
        loading: false,
      };
    case ExpertListTableActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: payload,
      };
    case ExpertListTableActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
      };
    case ExpertListTableActionKind.CHANGE_SORT:
      return {
        ...state,
        sort: payload,
      };
    case ExpertListTableActionKind.CHANGE_LIMIT:
      return {
        ...state,
        limit: payload,
      };
    case ExpertListTableActionKind.CHANGE_ROOM:
      return {
        ...state,
        roomSort: payload,
      };
    case ExpertListTableActionKind.SELECT_ONE_EXPERT:
      return {
        ...state,
        selectedExperts: payload,
      };
    case ExpertListTableActionKind.CONFIRM_MODAL_OPEN:
      return {
        ...state,
        open: true,
      };
    case ExpertListTableActionKind.CONFIRM_MODAL_CLOSE:
      return {
        ...state,
        open: false,
        loading: false,
      };
    case ExpertListTableActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
  }
};

const ExpertListTableContainer = () => {
  const [currentTab, setCurrentTab] = useState<string>('all');
  const { user } = useAuth();

  const roomOption = [{ id: 0, title: '전체' }, ...user.cp_rooms];

  const initialState: newState = {
    experts: [],
    loading: false,
    error: null,
    page: 0,
    limit: 5,
    query: '',
    sort: sortOptions[0].value,
    open: false,
    selectedExperts: [],
    roomSort: roomOption[0].title,
  };
  const [newState, dispatch] = useReducer(
    ExpertListTableReducer,
    initialState,
  );

  const mounted = useMounted();
  const getExperts = useCallback(
    async (reload = false) => {
      dispatch({ type: ExpertListTableActionKind.LOADING });
      try {
        const response = await APIExpert.getList();
        const CPresponse = await APIExpert.getCPList();
        if (mounted || reload) {
          dispatch({
            type: ExpertListTableActionKind.GET_EXPERTS,
            payload: [...CPresponse.data, ...response.data],
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: ExpertListTableActionKind.ERROR,
          payload: err,
        });
      }
    },
    [mounted],
  );

  useEffect(() => {
    getExperts();
    setCurrentTab('all');
  }, [getExperts]);

  //* 삭제 모달 열기
  const onClickDelete = () => {
    dispatch({ type: ExpertListTableActionKind.CONFIRM_MODAL_OPEN });
  };

  //* 삭제 모달 닫기
  const onClickDeleteClose = () => {
    dispatch({ type: ExpertListTableActionKind.CONFIRM_MODAL_CLOSE });
  };

  const reload = () => {
    getExperts();
  };

  const handleDelete = async () => {
    dispatch({ type: ExpertListTableActionKind.LOADING });
    try {
      const expertId = newState.selectedExperts[0];
      console.log(expertId);
      const response = await cmsServer.put(
        `/cp-feeds/${expertId.toString()}`,
        {
          isDeleted: true,
        },
      );

      if (response.status === 200) {
        reload();
      }
      dispatch({
        type: ExpertListTableActionKind.SELECT_ONE_EXPERT,
        payload: [],
      });
    } catch (e) {
      dispatch({ type: ExpertListTableActionKind.ERROR, payload: e });
    } finally {
      dispatch({
        type: ExpertListTableActionKind.CONFIRM_MODAL_CLOSE,
      });
      dispatch({
        type: ExpertListTableActionKind.SELECT_ONE_EXPERT,
        payload: [],
      });
    }
  };

  //* 검색어
  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: ExpertListTableActionKind.CHANGE_QUERY,
      payload: String(event.target.value),
    });
  };

  //* 정렬 변경
  const handleSortChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: ExpertListTableActionKind.CHANGE_SORT,
      payload: event.target.value as Sort,
    });
  };
  //* 방 정렬 변경
  const handleRoomChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: ExpertListTableActionKind.CHANGE_ROOM,
      payload: event.target.value,
    });
  };

  //* 페이지 변경
  const handlePageChange = (__: any, newPage: number): void => {
    dispatch({
      type: ExpertListTableActionKind.CHANGE_PAGE,
      payload: newPage,
    });
  };

  //* 리스트 수 변경
  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: ExpertListTableActionKind.CHANGE_LIMIT,
      payload: parseInt(event.target.value, 10),
    });
  };

  //* 리스트에서 게시글 선택
  const handleSelectOneExpert = (
    __: ChangeEvent<HTMLInputElement>,
    expertId: number,
  ): void => {
    if (!newState.selectedExperts.includes(expertId)) {
      dispatch({
        type: ExpertListTableActionKind.SELECT_ONE_EXPERT,
        payload: [expertId],
      });
    } else {
      dispatch({
        type: ExpertListTableActionKind.SELECT_ONE_EXPERT,
        payload: newState.selectedExperts.filter(
          (id) => id !== expertId,
        ),
      });
    }
  };
  //* 최종 리스트, 정렬 데이터
  const filteredExperts = applyFilters(
    newState.experts,
    newState.query,
  );
  const sortedExperts = applySort(
    filteredExperts,
    newState.sort,
    newState.roomSort,
  );
  const paginatedExperts = applyPagination(
    sortedExperts,
    newState.page,
    newState.limit,
  );
  const enableBulkActions = newState.selectedExperts.length > 0;
  return (
    <ExpertListTablePresenter
      newState={newState}
      currentTab={currentTab}
      handleQueryChange={handleQueryChange}
      handleSortChange={handleSortChange}
      enableBulkActions={enableBulkActions}
      onClickDelete={onClickDelete}
      paginatedExperts={paginatedExperts}
      handleSelectOneExpert={handleSelectOneExpert}
      handlePageChange={handlePageChange}
      handleLimitChange={handleLimitChange}
      handleRoomChange={handleRoomChange}
      onClickDeleteClose={onClickDeleteClose}
      handleDelete={handleDelete}
      reload={reload}
    />
  );
};

export default ExpertListTableContainer;
