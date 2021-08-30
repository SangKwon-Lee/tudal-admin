import React, {
  useState,
  useRef,
  useCallback,
  useReducer,
  useEffect,
  ChangeEvent,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Schedule } from 'src/types/schedule';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  LinearProgress,
  Link,
  Typography,
} from '@material-ui/core';
import toast, { Toaster } from 'react-hot-toast';
import { ScheduleForm } from 'src/components/dashboard/schedule';
import ChevronRightIcon from '../../icons/ChevronRight';
import { ScheduleListTable } from '../../components/dashboard/schedule';
import useSettings from 'src/hooks/useSettings';
import useAsync from 'src/hooks/useAsync';
import { APISchedule } from 'src/lib/api';
import { AxiosError } from 'axios';
import * as _ from 'lodash';
import useMounted from 'src/hooks/useMounted';
enum ScheduleActionKind {
  LOADING = 'LOADING',
  ADD_SCHEDULE = 'ADD_SCHEDULE',
  LOAD_SCHEDULE = 'LOAD_SCHEDULE',
  RELOAD_SCHEDULE = 'RELOAD_SCHEDULE',
  SHOW_SELECT_CONFIRM = 'SHOW_SELECT_CONFIRM',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',
  ERROR = 'ERROR',
}

interface ScheduleAction {
  type: ScheduleActionKind;
  payload?: any;
}

interface scheduleState {
  list: Schedule[];
  loading: boolean;
  isOpenConfirm: boolean;
  error: AxiosError<any> | boolean;
}

const initialState: scheduleState = {
  list: [],
  loading: true,
  error: null,
  isOpenConfirm: false,
};

const scheduleReducer = (
  state: scheduleState,
  action: ScheduleAction,
): scheduleState => {
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
    case ScheduleActionKind.RELOAD_SCHEDULE:
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
  }
};

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

const ScheduleList: React.FC = () => {
  const { settings } = useSettings();
  const scrollRef = useRef(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(50);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [targetModify, setTargetModify] = useState<Schedule>(null);
  const [scheduleState, dispatch] = useReducer(
    scheduleReducer,
    initialState,
  );
  const mounted = useMounted();

  const { list, loading } = scheduleState;

  const handlePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
  ): void => {
    if ((page + 1) * limit >= list.length - limit) {
      setShouldUpdate(true);
    }
    setPage(newPage);
  };

  const handleLimit = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setLimit(parseInt(event.target.value, 10));
  };
  const getSchedule = useCallback(async () => {
    dispatch({ type: ScheduleActionKind.LOADING });
    try {
      setPage(0);
      const { data } = await APISchedule.getList(search, sort);
      dispatch({
        type: ScheduleActionKind.LOAD_SCHEDULE,
        payload: data,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: ScheduleActionKind.ERROR, payload: error });
    }
  }, [search, sort]);

  const addSchedule = useCallback(async () => {
    try {
      const { data } = await APISchedule.getList(
        search,
        sort,
        (page + 1) * limit,
      );
      dispatch({
        type: ScheduleActionKind.ADD_SCHEDULE,
        payload: data,
      });
      setShouldUpdate(false);
    } catch (error) {}
  }, [page, limit, search, sort]);

  const realodSchedule = useCallback(async () => {
    try {
      const { data } = await APISchedule.getList(
        search,
        0,
        (page + 1) * limit,
      );
      dispatch({
        type: ScheduleActionKind.RELOAD_SCHEDULE,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, [page, limit, search]);

  useEffect(() => {
    shouldUpdate && addSchedule();
  }, [addSchedule, shouldUpdate]);

  useEffect(() => {
    mounted && getSchedule();
  }, [getSchedule, mounted]);

  useEffect(() => {
    scrollRef &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  const reload = () => realodSchedule();

  const postDelete = async (id: number) => {
    try {
      const { status } = await APISchedule.deleteItem(id);
      if (status === 200) {
        reload();
      }
      if (status === 404) {
        toast.error('존재하지 않는 스케줄입니다. 확인 부탁드립니다.');
      }
    } catch (error) {
      toast.error(
        '삭제에 실패했습니다. 관리자에게 문의해주시길 바랍니다.',
      );
    }
  };

  const clearTargetModify = () => {
    setTargetModify(null);
  };

  const handleSearch = _.debounce(setSearch, 300);

  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
      </Helmet>
      <Toaster />

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container
          maxWidth={settings.compact ? 'xl' : false}
          ref={scrollRef}
        >
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                일정 리스트
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  대시보드
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  컨텐츠관리
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  일정
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <ScheduleForm
            reload={reload}
            targetModify={targetModify}
            clearTargetModify={clearTargetModify}
          />
          <Box sx={{ mt: 3 }}>
            {loading && <LinearProgress />}
            <ScheduleListTable
              schedules={list}
              reload={reload}
              search={search}
              page={page}
              limit={limit}
              sortOptions={sortOptions}
              sort={sort}
              handleSort={setSort}
              handlePage={handlePage}
              handleLimit={handleLimit}
              setSearch={handleSearch}
              postDelete={postDelete}
              setTargetModify={setTargetModify}
              scrollRef={scrollRef}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ScheduleList;
