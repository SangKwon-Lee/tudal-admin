import React, {
  RefObject,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import { APIHR } from 'src/lib/api';
import { IHRImage } from 'src/types/hiddenreport';
import HiddenreportImageListPresenter from './HiddenreportImageList.Presenter';

export enum HRImageListActionKind {
  LOADING = 'LOADING',
  LOAD_IMAGES = 'LOAD_IMAGES',
  SELECT_TARGET = 'SELECT_TARGET',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',

  // QUERY/
  CHANGE_QUERY = 'CHANG_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
}

type Sort = 'created_at:desc' | 'created_at:asc';

interface SortOption {
  value: Sort;
  label: string;
}
export const sortOptions: SortOption[] = [
  {
    label: '등록순 (최신)',
    value: 'created_at:desc',
  },
  {
    label: '등록순 (오래된)',
    value: 'created_at:asc',
  },
];

export interface IHRimageListAction {
  type: HRImageListActionKind;
  payload?: any;
}

export interface IHRImageListState {
  list: IHRImage[];
  listLength: number;
  loading: boolean;
  targetSelect: IHRImage;
  isOpenConfirm: boolean;
  page: number;
  query: {
    _q: string;
    _start: number;
    _limit: number;
    _sort: string;
  };
}

const initialState: IHRImageListState = {
  list: [],
  listLength: 0,
  targetSelect: null,
  loading: true,
  page: 1,
  isOpenConfirm: false,
  query: {
    _q: '',
    _start: 0,
    _limit: 50,
    _sort: sortOptions[0].value,
  },
};

const HRImageListReducer = (
  state: IHRImageListState,
  action: IHRimageListAction,
): IHRImageListState => {
  const { type, payload } = action;
  switch (type) {
    case HRImageListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case HRImageListActionKind.LOAD_IMAGES:
      return {
        ...state,
        loading: false,
        list: payload.data,
        listLength: payload.count,
      };

    case HRImageListActionKind.SELECT_TARGET:
      return {
        ...state,
        targetSelect: payload,
      };

    case HRImageListActionKind.CHANGE_QUERY:
      const { name, value } = payload;
      return {
        ...state,
        query: {
          ...state.query,
          [name]: value,
          _start: 0,
        },
        page: 1,
      };
    case HRImageListActionKind.CLOSE_SELECT_CONFIRM:
      return {
        ...state,
        targetSelect: null,
      };
    case HRImageListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * state.query._limit,
        },
      };
  }
};

const HiddenReportImageListContainer: React.FC<{
  pageTopRef: RefObject<HTMLDivElement>;
}> = ({ pageTopRef }) => {
  const [HRImageListState, dispatch] = useReducer(
    HRImageListReducer,
    initialState,
  );

  const { query } = HRImageListState;
  const getList = useCallback(
    async (scrollToTop = true) => {
      try {
        const { data, status } = await APIHR.getImageList(query);
        if (status === 200) {
          const { data: count } = await APIHR.getImageListLength(
            query,
          );
          dispatch({
            type: HRImageListActionKind.LOAD_IMAGES,
            payload: { data, count },
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        scrollToTop &&
          pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [query, pageTopRef],
  );

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <HiddenreportImageListPresenter
      state={HRImageListState}
      dispatch={dispatch}
    />
  );
};

export default HiddenReportImageListContainer;
