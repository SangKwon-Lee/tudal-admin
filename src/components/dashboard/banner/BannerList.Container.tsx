import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { APIBanner, APIHR } from 'src/lib/api';
import { IHR } from 'src/types/hiddenreport';
import { swapItems } from 'src/utils/helper';
import BannerListPresenter from './BannerList.Presenter';

export enum BannerListActionKind {
  LOADING = 'LOADING',
  GET_ALL_REPORTS = 'GET_ALL_REPORTS',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_ORDER_EDIT = 'CHANGE_EDIT',
  GET_OPEN_BANNER = 'GET_OPEN_BANNER',
}

export interface BannerListAction {
  type: BannerListActionKind;
  payload?: any;
}

export interface BannerListState {
  loading: boolean;
  openBannerList: any[];
  reports: IHR[];
  query: {
    _start: number;
    _limit: number;
    _q: string;
    _sort: string;
  };
  page: number;
  reportsLength: number;
  orderEdit: boolean;
  newOrder: any[];
}

const initialState: BannerListState = {
  openBannerList: [],
  loading: false,
  reports: [],
  query: {
    _q: '',
    _start: 0,
    _limit: 50,
    _sort: 'created_at:DESC',
  },
  page: 1,
  reportsLength: 0,
  orderEdit: false,
  newOrder: [],
};

const BannerListReducer = (
  state: BannerListState,
  action: BannerListAction,
): BannerListState => {
  const { type, payload } = action;
  switch (type) {
    case BannerListActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case BannerListActionKind.GET_ALL_REPORTS:
      return {
        ...state,
        reports: payload.data,
        reportsLength: payload.count,
        loading: false,
      };
    case BannerListActionKind.CHANGE_QUERY:
      const { name, value } = payload;
      return {
        ...state,
        page: 1,
        query: {
          ...state.query,
          [name]: value,
        },
      };
    case BannerListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * state.query._limit,
        },
      };
    case BannerListActionKind.CHANGE_ORDER_EDIT:
      return {
        ...state,
        orderEdit: payload,
      };
    case BannerListActionKind.GET_OPEN_BANNER:
      return {
        ...state,
        openBannerList: payload,
      };
  }
};

const BannerListContainer = () => {
  const [bannerListState, dispatch] = useReducer(
    BannerListReducer,
    initialState,
  );

  const getAllReports = useCallback(async () => {
    dispatch({ type: BannerListActionKind.LOADING, payload: true });
    try {
      const { data, status } = await APIHR.getList(
        bannerListState.query,
      );
      const { data: count } = await APIHR.getListLength(
        bannerListState.query,
      );
      if (status === 200) {
        dispatch({
          type: BannerListActionKind.GET_ALL_REPORTS,
          payload: { data, count },
        });
        dispatch({
          type: BannerListActionKind.GET_OPEN_BANNER,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [bannerListState.query]);

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  const postOneBanner = async (e: any) => {
    dispatch({ type: BannerListActionKind.LOADING, payload: true });
    try {
      const { status } = await APIBanner.postOneImage(e.target.id);
      if (status === 200) {
        toast.success('배너가 등록됐습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* Drag * Drop
  const moveCard = async (
    dragIndex?: number,
    hoverIndex?: number,
  ) => {
    let card = [...bannerListState.openBannerList];
    let cardSlice = card.splice(dragIndex - 1, 1);
    card.splice(hoverIndex - 1, 0, cardSlice[0]);
    if (bannerListState.orderEdit) {
      console.log(card);
      dispatch({
        type: BannerListActionKind.GET_OPEN_BANNER,
        payload: card,
      });
    } else {
      toast.error('수정 모드가 아닙니다.');
    }
  };

  return (
    <BannerListPresenter
      bannerListState={bannerListState}
      dispatch={dispatch}
      postOneBanner={postOneBanner}
      moveCard={moveCard}
    />
  );
};

export default BannerListContainer;
