import { FC, useReducer } from 'react';
import { APICoupon } from 'src/lib/api';
import CouponCreatePresenter from './CouponCreate.Presenter';
import {
  CouponListTableAction,
  CouponListTableActionKind,
} from './CouponListTable.Container';
import toast from 'react-hot-toast';
import useAuth from 'src/hooks/useAuth';
import { expirationDate } from 'src/utils/expirationDate';
import dayjs from 'dayjs';
interface ICouponCreateProps {
  openModal: boolean;
  listDispatch: (params: CouponListTableAction) => void;
  getCouponList: () => void;
  getCouponListLength: () => void;
}

export enum CouponCreateActionKind {
  LOADING = 'LOADING',
  CREATE_COUPON = 'CREATE_COUPON',
  //changes
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_EXPIRATIONDATE = 'CHANGE_EXPIRATIONDATE',
  RESET_STATE = 'RESET_STATE',
}
export interface CouponCreateAction {
  type: CouponCreateActionKind;
  payload?: any;
}

export interface CouponCreateState {
  loading: boolean;
  createInput: {
    name: string;
    code: string;
    agency: string;
    displayName: string;
    type: string;
    applyDays: number;
    issuedDate: any;
    expirationDate: any;
    quantity: number;
  };
}
let newDate = dayjs();
newDate = newDate.add(7, 'day');

const initialState: CouponCreateState = {
  loading: false,
  createInput: {
    name: '',
    code: '',
    agency: '',
    displayName: '',
    type: 'premium',
    applyDays: 7,
    issuedDate: dayjs().format(),
    expirationDate: newDate.format(),
    quantity: 1,
  },
};

const CouponCreateReducer = (
  state: CouponCreateState,
  action: CouponCreateAction,
): CouponCreateState => {
  const { type, payload } = action;
  switch (type) {
    case CouponCreateActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case CouponCreateActionKind.CHANGE_INPUT:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          [payload.target.name]: payload.target.value,
        },
      };
    case CouponCreateActionKind.CHANGE_EXPIRATIONDATE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          expirationDate: payload,
        },
      };
    case CouponCreateActionKind.RESET_STATE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          name: '',
          code: '',
          agency: '',
          displayName: '',
          type: 'premium',
          applyDays: 7,
          issuedDate: dayjs().format(),
          expirationDate: newDate,
          quantity: 1,
        },
      };
  }
};

const CouponCreateContainer: FC<ICouponCreateProps> = (props) => {
  const [couponCreateState, dispatch] = useReducer(
    CouponCreateReducer,
    initialState,
  );
  const { openModal, listDispatch } = props;
  const { user } = useAuth();

  //* 쿠폰 생성
  const createCoupon = async () => {
    dispatch({ type: CouponCreateActionKind.LOADING });
    const newCoupon = {
      ...couponCreateState.createInput,
      code: '',
      issuedBy: user.id,
      expirationDate: couponCreateState.createInput.expirationDate,
      isUsed: false,
    };

    try {
      const { status } = await APICoupon.createCoupon(newCoupon);
      if (status === 200) {
        toast.success('쿠폰이 생성됐습니다.');
        listDispatch({
          type: CouponListTableActionKind.CLOSE_CREATE_DIALOG,
        });
        dispatch({
          type: CouponCreateActionKind.RESET_STATE,
        });
        props.getCouponList();
        props.getCouponListLength();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 쿠폰 유효기간 변경 함수
  const handleChangeExpirationDate = (event) => {
    const newDate = expirationDate(event.target.value);
    dispatch({
      type: CouponCreateActionKind.CHANGE_EXPIRATIONDATE,
      payload: newDate,
    });
  };

  return (
    <CouponCreatePresenter
      couponCreateState={couponCreateState}
      openModal={openModal}
      listDispatch={listDispatch}
      dispatch={dispatch}
      createCoupon={createCoupon}
      handleChangeExpirationDate={handleChangeExpirationDate}
    />
  );
};
export default CouponCreateContainer;
