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
  listDispatch?: (params: CouponListTableAction) => void;
  getCouponList?: () => void;
  getCouponListLength?: () => void;
}

export enum CouponCreateActionKind {
  LOADING = 'LOADING',
  CREATE_COUPON = 'CREATE_COUPON',
  //changes
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_EXPIRATIONDATE = 'CHANGE_EXPIRATIONDATE',
  RESET_STATE = 'RESET_STATE',
  WRITE_APPLY_DAYS = 'WRITE_APPLY_DAYS',
  WRITE_QUANTITY = 'WRITE_QUANTITY',
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
  isWriteApplyDays: boolean;
  isWriteQuantity: boolean;
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
    issuedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    expirationDate: newDate.format('YYYY-MM-DD HH:mm:ss'),
    quantity: 1,
  },
  isWriteApplyDays: false,
  isWriteQuantity: false,
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
          issuedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          expirationDate: newDate,
          quantity: 1,
        },
      };
    case CouponCreateActionKind.WRITE_APPLY_DAYS:
      return {
        ...state,
        isWriteApplyDays: payload,
      };
    case CouponCreateActionKind.WRITE_QUANTITY:
      return {
        ...state,
        isWriteQuantity: payload,
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
    const newCouponType = {
      type: couponCreateState.createInput.type,
      agency: couponCreateState.createInput.agency,
      displayName: couponCreateState.createInput.displayName,
      name: couponCreateState.createInput.name,
      issuedBy: user.id,
      applyDays: couponCreateState.createInput.applyDays,
    };
    try {
      const { status, data } = await APICoupon.createCoupon(
        newCouponType,
      );
      const CouponInput = {
        quantity: couponCreateState.createInput.quantity,
        issuedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        expirationDate: couponCreateState.createInput.expirationDate,
        coupon: data.id,
        isUsed: false,
        code: '',
        issuedBy: user.id,
      };
      if (status === 200) {
        toast.success('쿠폰이 생성됐습니다.');
        listDispatch({
          type: CouponListTableActionKind.CLOSE_CREATE_DIALOG,
        });
        dispatch({
          type: CouponCreateActionKind.RESET_STATE,
        });
        await APICoupon.createIssuedCoupon(CouponInput);
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
