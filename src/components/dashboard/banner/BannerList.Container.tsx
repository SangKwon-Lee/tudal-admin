import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { APIBanner, APIHR } from 'src/lib/api';
import { IHR } from 'src/types/hiddenreport';
import BannerListPresenter from './BannerList.Presenter';

export enum BannerListActionKind {
  LOADING = 'LOADING',
  GET_ALL_REPORTS = 'GET_ALL_REPORTS',
  GET_OPEN_BANNER = 'GET_OPEN_BANNER',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_ORDER_EDIT = 'CHANGE_EDIT',
  CHANGE_NEWORDER = 'CHANGE_NEWORDER',
  CHANGE_OPEN_MODAL = 'CHANGE_OPEN_MODAL',
  CHANGE_POST_ID = 'CHANGE_POST_ID',
}

export interface BannerListAction {
  type: BannerListActionKind;
  payload?: any;
}

export interface BannerListState {
  loading: boolean;
  openBannerList: IHR[];
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
  newOrder: IHR[];
  openModal: boolean;
  postId: number | string;
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
  openModal: false,
  postId: 0,
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
    case BannerListActionKind.CHANGE_NEWORDER:
      return {
        ...state,
        newOrder: payload,
      };
    case BannerListActionKind.CHANGE_OPEN_MODAL:
      return {
        ...state,
        openModal: payload,
      };
    case BannerListActionKind.CHANGE_POST_ID:
      return {
        ...state,
        postId: payload,
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
      }
    } catch (error) {
      console.log(error);
    }
  }, [bannerListState.query]);

  const getOpenBanners = useCallback(async () => {
    try {
      const { data, status } = await APIBanner.getBanners();
      if (status === 200) {
        dispatch({
          type: BannerListActionKind.GET_OPEN_BANNER,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getOpenBanners();
    getAllReports();
  }, [getAllReports, getOpenBanners]);

  const postOneBanner = async () => {
    dispatch({ type: BannerListActionKind.LOADING, payload: true });
    try {
      const newData = { candidate: String(bannerListState.postId) };
      const { status } = await APIBanner.postOneImage(newData);
      if (status === 200) {
        toast.success('배너가 등록됐습니다.');
        dispatch({
          type: BannerListActionKind.LOADING,
          payload: false,
        });

        getOpenBanners();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch({
        type: BannerListActionKind.CHANGE_OPEN_MODAL,
        payload: false,
      });
    }
  };

  const saveBanner = async () => {
    try {
      const newData = {
        candidates: bannerListState.newOrder.map((data) => data.id),
      };
      const { status } = await APIBanner.putBanner(newData);

      if (status === 200) {
        getOpenBanners();
        toast.success('배너가 수정됐습니다.');
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      dispatch({
        type: BannerListActionKind.CHANGE_OPEN_MODAL,
        payload: false,
      });
      dispatch({
        type: BannerListActionKind.CHANGE_ORDER_EDIT,
        payload: false,
      });
    }
  };

  //* Drag * Drop
  const moveCard = async (
    dragIndex?: number,
    hoverIndex?: number,
  ) => {
    let card = [...bannerListState.newOrder];
    let cardSlice = card.splice(dragIndex - 1, 1);
    card.splice(hoverIndex - 1, 0, cardSlice[0]);
    if (bannerListState.orderEdit) {
      dispatch({
        type: BannerListActionKind.CHANGE_NEWORDER,
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
      saveBanner={saveBanner}
    />
  );
};

export default BannerListContainer;
