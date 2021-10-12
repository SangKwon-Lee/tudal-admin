import { useCallback, useEffect, useReducer, useState } from 'react';
import type { ChangeEvent } from 'react';
import { cmsServer } from '../../../lib/axios';
import {
  applyFilters,
  applyPagination,
  applySort,
} from '../../../utils/sort';
import { APIMaster } from 'src/lib/api';
import MasterListTablePresenter from './MasterListTable.Presenter';
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

enum MasterListTableActionKind {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  GET_ROOM = 'GET_ROOM',
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

interface MasterListTableAction {
  type: MasterListTableActionKind;
  payload?: any;
}

interface newState {
  masters: any;
  page: number;
  limit: number;
  query: string;
  open: boolean;
  sort: Sort;
  selectedMasters: number[];
  loading: boolean;
  error: AxiosError<any> | boolean;
  roomSort: any;
  master_room: any;
}

const MasterListTableReducer = (
  state: newState,
  action: MasterListTableAction,
): newState => {
  const { type, payload } = action;
  switch (type) {
    case MasterListTableActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case MasterListTableActionKind.GET_EXPERTS:
      return {
        ...state,
        masters: payload,
        loading: false,
      };
    case MasterListTableActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: payload,
      };
    case MasterListTableActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
      };
    case MasterListTableActionKind.CHANGE_SORT:
      return {
        ...state,
        sort: payload,
      };
    case MasterListTableActionKind.CHANGE_LIMIT:
      return {
        ...state,
        limit: payload,
      };
    case MasterListTableActionKind.CHANGE_ROOM:
      return {
        ...state,
        roomSort: payload,
      };
    case MasterListTableActionKind.SELECT_ONE_EXPERT:
      return {
        ...state,
        selectedMasters: payload,
      };
    case MasterListTableActionKind.CONFIRM_MODAL_OPEN:
      return {
        ...state,
        open: true,
      };
    case MasterListTableActionKind.CONFIRM_MODAL_CLOSE:
      return {
        ...state,
        open: false,
        loading: false,
      };
    case MasterListTableActionKind.ERROR:
      return {
        ...state,
        error: payload,
      };
    case MasterListTableActionKind.GET_ROOM: {
      return {
        ...state,
        master_room: payload,
      };
    }
  }
};

const MasterListTableContainer = () => {
  const [currentTab, setCurrentTab] = useState<string>('all');

  const initialState: newState = {
    masters: [],
    loading: false,
    error: null,
    page: 0,
    limit: 5,
    query: '',
    sort: sortOptions[0].value,
    open: false,
    selectedMasters: [],
    roomSort: '',
    master_room: [],
  };
  const [newState, dispatch] = useReducer(
    MasterListTableReducer,
    initialState,
  );

  const mounted = useMounted();
  const { user } = useAuth();
  const getMasterRoom = async () => {
    try {
      const { data } = await cmsServer.get(
        `/master-rooms?master.id=${user.id}`,
      );
      dispatch({
        type: MasterListTableActionKind.GET_ROOM,
        payload: [{ title: '전체' }, ...data],
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(newState.master_room);
  //* 방 정보 불러오는 useEffect
  useEffect(() => {
    getMasterRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getMasters = useCallback(
    async (reload = false) => {
      dispatch({ type: MasterListTableActionKind.LOADING });
      try {
        const response = await APIMaster.getList();
        const masterresponse = await APIMaster.getMasterList();
        if (mounted || reload) {
          dispatch({
            type: MasterListTableActionKind.GET_EXPERTS,
            payload: [...masterresponse.data, ...response.data],
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: MasterListTableActionKind.ERROR,
          payload: err,
        });
      }
    },
    [mounted],
  );

  useEffect(() => {
    getMasters();
    setCurrentTab('all');
  }, [getMasters]);

  //* 삭제 모달 열기
  const onClickDelete = () => {
    dispatch({ type: MasterListTableActionKind.CONFIRM_MODAL_OPEN });
  };

  //* 삭제 모달 닫기
  const onClickDeleteClose = () => {
    dispatch({ type: MasterListTableActionKind.CONFIRM_MODAL_CLOSE });
  };

  const reload = () => {
    getMasters();
  };

  const handleDelete = async () => {
    dispatch({ type: MasterListTableActionKind.LOADING });
    try {
      const masterId = newState.selectedMasters[0];
      console.log(masterId);
      const response = await cmsServer.put(
        `/master-feeds/${masterId.toString()}`,
        {
          isDeleted: true,
        },
      );

      if (response.status === 200) {
        reload();
      }
      dispatch({
        type: MasterListTableActionKind.SELECT_ONE_EXPERT,
        payload: [],
      });
    } catch (e) {
      dispatch({ type: MasterListTableActionKind.ERROR, payload: e });
    } finally {
      dispatch({
        type: MasterListTableActionKind.CONFIRM_MODAL_CLOSE,
      });
      dispatch({
        type: MasterListTableActionKind.SELECT_ONE_EXPERT,
        payload: [],
      });
    }
  };

  //* 검색어
  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: MasterListTableActionKind.CHANGE_QUERY,
      payload: String(event.target.value),
    });
  };

  //* 정렬 변경
  const handleSortChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: MasterListTableActionKind.CHANGE_SORT,
      payload: event.target.value as Sort,
    });
  };
  //* 방 정렬 변경
  const handleRoomChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: MasterListTableActionKind.CHANGE_ROOM,
      payload: event.target.value,
    });
  };

  //* 페이지 변경
  const handlePageChange = (__: any, newPage: number): void => {
    dispatch({
      type: MasterListTableActionKind.CHANGE_PAGE,
      payload: newPage,
    });
  };

  //* 리스트 수 변경
  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch({
      type: MasterListTableActionKind.CHANGE_LIMIT,
      payload: parseInt(event.target.value, 10),
    });
  };

  //* 리스트에서 게시글 선택
  const handleSelectOneMaster = (
    __: ChangeEvent<HTMLInputElement>,
    masterId: number,
  ): void => {
    if (!newState.selectedMasters.includes(masterId)) {
      dispatch({
        type: MasterListTableActionKind.SELECT_ONE_EXPERT,
        payload: [masterId],
      });
    } else {
      dispatch({
        type: MasterListTableActionKind.SELECT_ONE_EXPERT,
        payload: newState.selectedMasters.filter(
          (id) => id !== masterId,
        ),
      });
    }
  };
  //* 최종 리스트, 정렬 데이터
  const filteredMasters = applyFilters(
    newState.masters,
    newState.query,
  );
  const sortedMasters = applySort(
    filteredMasters,
    newState.sort,
    newState.roomSort,
  );
  const paginatedMasters = applyPagination(
    sortedMasters,
    newState.page,
    newState.limit,
  );
  const enableBulkActions = newState.selectedMasters.length > 0;
  return (
    <MasterListTablePresenter
      newState={newState}
      currentTab={currentTab}
      handleQueryChange={handleQueryChange}
      handleSortChange={handleSortChange}
      enableBulkActions={enableBulkActions}
      onClickDelete={onClickDelete}
      paginatedMasters={paginatedMasters}
      handleSelectOneMaster={handleSelectOneMaster}
      handlePageChange={handlePageChange}
      handleLimitChange={handleLimitChange}
      handleRoomChange={handleRoomChange}
      onClickDeleteClose={onClickDeleteClose}
      handleDelete={handleDelete}
      reload={reload}
    />
  );
};

export default MasterListTableContainer;
