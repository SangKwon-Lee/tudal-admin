import { useCallback, useEffect, useReducer } from 'react';
import { APICoupon } from 'src/lib/api';
import { CouponType } from 'src/types/coupon';
import CouponListTablePresenter from './CouponListTable.Presenter';
import toast from 'react-hot-toast';
export enum CouponListTableActionKind {
  //loading
  LOADING = 'LOADING',

  // Load APIS
  GET_COUPON = 'GET_COUPON',
  GET_COUPON_LENGTH = 'GET_COUPON_LENGTH',

  // changes
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_ISUSED = 'CHANGE_ISUSED',
  CHANGE_SORT = 'CHANGE_SORT',

  // delete & update
  SELECT_COUPON = 'SELECT_COUPON',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
  OPEN_CREATE_DIALOG = 'OPEN_CREATE_DIALOG',
  CLOSE_CREATE_DIALOG = 'CLOSE_CREATE_DIALOG',
}

export interface CouponListTableAction {
  type: CouponListTableActionKind;
  payload?: any;
}

export interface CouponListTableState {
  loading: boolean;
  page: number;
  listLength: number;
  selected: number[];
  list: CouponType[];
  query: {
    _start: number;
    _limit: number;
    _q: string;
  };
  delete: {
    isDeleting: boolean;
    target: number;
  };
  sort: string;
  openModal: boolean;
}

const initialState: CouponListTableState = {
  loading: false,
  list: [],
  listLength: 0,
  selected: [],
  page: 1,
  query: {
    _q: '',
    _start: 0,
    _limit: 50,
  },
  delete: {
    isDeleting: false,
    target: null,
  },
  sort: 'created_at:DESC',
  openModal: false,
};

const CouponListTableReducer = (
  state: CouponListTableState,
  action: CouponListTableAction,
): CouponListTableState => {
  const { type, payload } = action;
  switch (type) {
    case CouponListTableActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case CouponListTableActionKind.GET_COUPON:
      return {
        ...state,
        list: payload,
        loading: false,
      };
    case CouponListTableActionKind.GET_COUPON_LENGTH:
      return {
        ...state,
        listLength: payload,
        loading: false,
      };
    case CouponListTableActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
          _start: 0,
        },
        page: 1,
      };
    case CouponListTableActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
    case CouponListTableActionKind.CHANGE_ISUSED:
      return {
        ...state,
        query: {
          ...state.query,
        },
      };
    case CouponListTableActionKind.CHANGE_SORT:
      return {
        ...state,
        sort: payload,
        query: {
          ...state.query,
          _start: 0,
        },
        page: 1,
      };
    case CouponListTableActionKind.OPEN_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    case CouponListTableActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };
    case CouponListTableActionKind.SELECT_COUPON:
      return {
        ...state,
        selected: payload,
      };
    case CouponListTableActionKind.OPEN_CREATE_DIALOG:
      return {
        ...state,
        openModal: true,
      };
    case CouponListTableActionKind.CLOSE_CREATE_DIALOG:
      return {
        ...state,
        openModal: false,
      };
  }
};

const CouponListTableContainer = () => {
  const [couponListTableState, dispatch] = useReducer(
    CouponListTableReducer,
    initialState,
  );

  //* 쿠폰 리스트 불러오기
  const getCouponList = async () => {
    dispatch({ type: CouponListTableActionKind.LOADING });
    try {
      const { data, status } = await APICoupon.getCoupons(
        couponListTableState.query,
        couponListTableState.sort,
      );

      if (status === 200) {
        dispatch({
          type: CouponListTableActionKind.GET_COUPON,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 리스트 전체 길이
  const getCouponListLength = useCallback(async () => {
    dispatch({ type: CouponListTableActionKind.LOADING });
    try {
      const { data, status } = await APICoupon.getCouponLength(
        couponListTableState.query,
      );
      if (status === 200) {
        dispatch({
          type: CouponListTableActionKind.GET_COUPON_LENGTH,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [couponListTableState.query]);

  //* 쿠폰 삭제
  const handleDelete = async () => {
    dispatch({ type: CouponListTableActionKind.LOADING });
    try {
      await Promise.all(
        couponListTableState.selected.map(async (data) => {
          return await APICoupon.deleteCoupon(data);
        }),
      );
      dispatch({
        type: CouponListTableActionKind.CLOSE_DELETE_DIALOG,
      });
      toast.success('쿠폰이 삭제 됐습니다.');
      dispatch({
        type: CouponListTableActionKind.SELECT_COUPON,
        payload: [],
      });
      getCouponList();
    } catch (error) {
      console.log(error);
    }
  };

  //* 쿠폰 선택
  const handleSelect = (event: any, selectId: number): void => {
    if (!couponListTableState.selected.includes(selectId)) {
      let newSelect = couponListTableState.selected;
      newSelect.push(selectId);
      dispatch({
        type: CouponListTableActionKind.SELECT_COUPON,
        payload: newSelect,
      });
    } else {
      let data = couponListTableState.selected.filter(
        (id) => id !== selectId,
      );
      dispatch({
        type: CouponListTableActionKind.SELECT_COUPON,
        payload: data,
      });
    }
  };
  //* 모든 쿠폰 선택
  const handleSelectAll = (event: any): void => {
    let data = event.target.checked
      ? couponListTableState.list.map((list) => list.id)
      : [];
    dispatch({
      type: CouponListTableActionKind.SELECT_COUPON,
      payload: data,
    });
  };

  useEffect(
    () => {
      getCouponList();
      getCouponListLength();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      getCouponListLength,
      couponListTableState.query,
      couponListTableState.sort,
    ],
  );

  return (
    <CouponListTablePresenter
      couponListTableState={couponListTableState}
      dispatch={dispatch}
      handleDelete={handleDelete}
      getCouponList={getCouponList}
      getCouponListLength={getCouponListLength}
      handleSelect={handleSelect}
      handleSelectAll={handleSelectAll}
    />
  );
};

export default CouponListTableContainer;
