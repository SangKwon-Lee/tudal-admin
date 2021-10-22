import React, { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { APIGold } from 'src/lib/api';
import { getUserLedger, getUserWallet } from 'src/lib/api/gold.api';
import {
  IGoldLedger,
  IGoldPostForm,
  IGoldWallet,
} from 'src/types/gold';
import GoldDetailPresenter from './GoldDetail.Presenter';
import dayjs from 'dayjs';
import { getCurrentDateString } from 'src/utils/helper';

export function getStringCode(length = 5) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength),
    );
  }
  return getCurrentDateString() + result;
}

export enum GoldDetailActionKind {
  LOADING = 'LOADING',
  LOAD_LEDGER = 'LOAD_LEDGER',
  LOAD_WALLET = 'LOAD_WALLET',
  HANDLE_DIALOG = 'HANDLE_DIALOG',
  CALCULATE_BY_HAND = 'CALCULATE_BY_HAND',

  // change form
  CHANGE_USERID = 'CHANGE_USERID',
  CHANGE_AMOUNT = 'CHANGE_AMOUNT',
  CHANGE_BONUSAMOUNT = 'CHANGE_BONUSAMOUNT',
  CHANGE_TYPE = 'CHANGE_TYPE',
  CHANGE_CATEGORY = 'CHANGE_CATEGORY',
  CHANGE_ISEXIRED = 'CHANGE_ISEXIRED',
  CHANGE_CODE = 'CHANGE_CODE',
}

export interface IGoldDetailAction {
  type: GoldDetailActionKind;
  payload?: any;
}

interface IGoldDetailContainerProps {
  userId: number;
  handleUser: (userId: number) => void;
}

export interface IGoldDetailState {
  ledger: IGoldLedger[];
  wallet: IGoldWallet;
  totalByHand: number;
  loading: boolean;
  openGoldAddDialog: boolean;
  postForm: IGoldPostForm;
}

const initialState: IGoldDetailState = {
  ledger: [],
  loading: true,
  wallet: null,
  totalByHand: 0,
  openGoldAddDialog: false,
  postForm: {
    userId: 0,
    amount: 0,
    bonusAmount: 0,
    type: 'add',
    category: '',
    isExpired: 0,
    datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    code: '',
  },
};

const goldDetailReducer = (
  state: IGoldDetailState,
  action: IGoldDetailAction,
): IGoldDetailState => {
  const { type, payload } = action;

  switch (type) {
    case GoldDetailActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case GoldDetailActionKind.LOAD_LEDGER:
      return {
        ...state,
        loading: false,
        ledger: payload,
      };
    case GoldDetailActionKind.LOAD_WALLET:
      return {
        ...state,
        wallet: payload,
      };
    case GoldDetailActionKind.HANDLE_DIALOG:
      return {
        ...state,
        openGoldAddDialog: payload,
      };
    case GoldDetailActionKind.CALCULATE_BY_HAND:
      return {
        ...state,
        totalByHand: payload,
      };

    //
    case GoldDetailActionKind.CHANGE_USERID:
      return {
        ...state,
        postForm: {
          ...state.postForm,
          userId: payload,
        },
      };
    case GoldDetailActionKind.CHANGE_AMOUNT:
      return {
        ...state,
        postForm: {
          ...state.postForm,
          amount: Number(payload),
        },
      };
    case GoldDetailActionKind.CHANGE_BONUSAMOUNT:
      return {
        ...state,
        postForm: {
          ...state.postForm,
          bonusAmount: Number(payload),
        },
      };
    case GoldDetailActionKind.CHANGE_CATEGORY:
      return {
        ...state,
        postForm: {
          ...state.postForm,
          category: payload,
        },
      };
    case GoldDetailActionKind.CHANGE_CODE:
      return {
        ...state,
        postForm: {
          ...state.postForm,
          code: payload,
        },
      };
    case GoldDetailActionKind.CHANGE_ISEXIRED:
      return {
        ...state,
        postForm: {
          ...state.postForm,
          isExpired: payload,
        },
      };
    case GoldDetailActionKind.CHANGE_TYPE:
      return {
        ...state,
        postForm: {
          ...state.postForm,
          type: payload,
        },
      };
  }
};

const GoldDetailContainer: React.FC<IGoldDetailContainerProps> = ({
  userId,
  handleUser,
}) => {
  const [goldDetailState, dispatch] = useReducer(
    goldDetailReducer,
    initialState,
  );

  const { ledger, postForm } = goldDetailState;
  const getLedger = useCallback(async () => {
    try {
      dispatch({ type: GoldDetailActionKind.LOADING });
      const { data, status } = await APIGold.getUserLedger(userId);
      if (status === 200) {
        dispatch({
          type: GoldDetailActionKind.LOAD_LEDGER,
          payload: data.histories.filter((el) => !el.isExpired),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  const getWallet = useCallback(async () => {
    try {
      dispatch({ type: GoldDetailActionKind.LOADING });
      const { data } = await APIGold.getUserWallet(userId);
      if (data[0]) {
        dispatch({
          type: GoldDetailActionKind.LOAD_WALLET,
          payload: data[0],
        });
      } else {
        toast.error('골드 내역이 없는 사용자입니다.');
        dispatch({
          type: GoldDetailActionKind.LOAD_WALLET,
          payload: null,
        });
        handleUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  const postGold = useCallback(async () => {
    try {
      const body = { ...postForm };
      body.code = getStringCode();
      const { status } = await APIGold.postAddGold(body);
      if (status === 200) {
        toast.success('성공적으로 충전되었습니다.');
        reload();
      }
    } catch (error) {
      console.log(error);
    }
  }, [postForm]);

  const reload = () => {
    getLedger();
    getWallet();
  };

  useEffect(() => {
    userId && getWallet() && getLedger();
  }, [getLedger, getWallet, userId]);

  useEffect(() => {
    const calculate = () => {
      if (ledger.length === 0) {
        return;
      }

      return ledger.reduce((acc, cur) => {
        if (cur.type === 'add') {
          return cur.bonusAmount + cur.amount + acc;
        }
        if (cur.type === 'subtract') {
          return acc - cur.bonusAmount - cur.amount;
        }
      }, 0);
    };

    dispatch({
      type: GoldDetailActionKind.CALCULATE_BY_HAND,
      payload: calculate(),
    });
  }, [ledger]);

  return (
    <GoldDetailPresenter
      userId={userId}
      handleUser={handleUser}
      postGold={postGold}
      state={goldDetailState}
      dispatch={dispatch}
    />
  );
};

export default GoldDetailContainer;
