import dayjs from 'dayjs';
import { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import { APICoupon } from 'src/lib/api';
import { CouponType, IssuedCoupon } from 'src/types/coupon';
import { expirationDate } from 'src/utils/expirationDate';
import CouponIssuedListTablePresenter from './CouponIssuedListTable.Presenter';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export enum CouponIssuedListTableActionKind {
  LOADING = 'LOADING',
  GET_COUPON = 'GET_COUPON',
  GET_ISSUED_COUPON = 'GET_ISSUED_COUPON',
  GET_ISSUED_COUPON_LENGTH = 'GET_COUPON_LENGTH',
  GET_ISUSED_LENGTH = 'GET_ISUSED_LENGTH',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  CHANGE_ISUSED = 'CHANGE_ISUSED',
  CHANGE_SORT = 'CHANGE_SORT',
  CHANGE_QUANTITY = 'CHANGE_QUANTITY',
  CHANGE_EXPIRATIONDATE = 'CHANGE_EXPIRATIONDATE',
  SELECT_COUPON = 'SELECT_COUPON',
  OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG',
  CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG',
}

export interface CouponIssuedListTableAction {
  type: CouponIssuedListTableActionKind;
  payload?: any;
}

export interface CouponIssuedListTableState {
  loading: boolean;
  list: IssuedCoupon[];
  listLength: number;
  isUsedLength: number;
  selected: number[];
  page: number;
  query: {
    _q: string;
    _start: number;
    _limit: number;
    _where: {
      isUsed: any;
    };
  };
  delete: {
    isDeleting: boolean;
    target: number;
  };
  sort: string;
  createInput: {
    code: string;
    issuedDate: string;
    expirationDate: string;
    quantity: number;
  };
  coupon: CouponType;
}

let newDate = dayjs();
newDate = newDate.add(7, 'day');

const initialState: CouponIssuedListTableState = {
  loading: false,
  list: [],
  coupon: {
    agency: '',
    applyDays: null,
    created_at: '',
    displayName: '',
    id: null,
    issuedBy: null,
    name: '',
    type: '',
  },
  listLength: 0,
  selected: [],
  page: 1,
  query: {
    _q: '',
    _start: 0,
    _limit: 50,
    _where: {
      isUsed: [0, 1],
    },
  },
  delete: {
    isDeleting: false,
    target: null,
  },
  sort: 'issuedDate:DESC',
  isUsedLength: 0,
  createInput: {
    code: '',
    issuedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    expirationDate: newDate.format('YYYY-MM-DD HH:mm:ss'),
    quantity: 1,
  },
};

const CouponIssuedListTableReducer = (
  state: CouponIssuedListTableState,
  action: CouponIssuedListTableAction,
): CouponIssuedListTableState => {
  const { type, payload } = action;
  switch (type) {
    case CouponIssuedListTableActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case CouponIssuedListTableActionKind.GET_COUPON:
      return {
        ...state,
        coupon: payload,
        loading: false,
      };
    case CouponIssuedListTableActionKind.GET_ISSUED_COUPON:
      return {
        ...state,
        list: payload,
        loading: false,
      };
    case CouponIssuedListTableActionKind.GET_ISSUED_COUPON_LENGTH:
      return {
        ...state,
        listLength: payload,
        loading: false,
      };
    case CouponIssuedListTableActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
      };
    case CouponIssuedListTableActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 50,
        },
      };
    case CouponIssuedListTableActionKind.CHANGE_LIMIT:
      return {
        ...state,
        query: { ...state.query, _limit: payload },
      };
    case CouponIssuedListTableActionKind.CHANGE_ISUSED:
      return {
        ...state,
        query: {
          ...state.query,
          _where: {
            ...state.query._where,
            isUsed: payload,
          },
        },
      };
    case CouponIssuedListTableActionKind.CHANGE_QUANTITY:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          quantity: payload,
        },
      };
    case CouponIssuedListTableActionKind.CHANGE_EXPIRATIONDATE:
      return {
        ...state,
        createInput: {
          ...state.createInput,
          expirationDate: payload,
        },
      };
    case CouponIssuedListTableActionKind.GET_ISUSED_LENGTH:
      return {
        ...state,
        isUsedLength: payload,
      };
    case CouponIssuedListTableActionKind.CHANGE_SORT:
      return {
        ...state,
        sort: payload,
      };
    case CouponIssuedListTableActionKind.OPEN_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: true,
          target: payload,
        },
      };
    case CouponIssuedListTableActionKind.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        delete: {
          isDeleting: false,
          target: null,
        },
      };
    case CouponIssuedListTableActionKind.SELECT_COUPON:
      return {
        ...state,
        selected: payload,
      };
  }
};

const CouponIssuedListTableContainer = () => {
  const [CouponIssuedListTableState, dispatch] = useReducer(
    CouponIssuedListTableReducer,
    initialState,
  );
  const { couponId } = useParams();
  const { user } = useAuth();

  //* 해당 쿠폰 내용 정보
  const getCoupon = async () => {
    try {
      const { data, status } = await APICoupon.getCouponDetail(
        couponId,
      );
      if (status === 200) {
        dispatch({
          type: CouponIssuedListTableActionKind.GET_COUPON,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 쿠폰 추가 발급
  const addIssuedCoupon = async () => {
    dispatch({
      type: CouponIssuedListTableActionKind.LOADING,
      payload: true,
    });
    try {
      const CouponInput = {
        quantity: CouponIssuedListTableState.createInput.quantity,
        issuedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        expirationDate:
          CouponIssuedListTableState.createInput.expirationDate,
        coupon: couponId,
        isUsed: false,
        code: '',
        issuedBy: user.id,
        applyDays: CouponIssuedListTableState.coupon.applyDays,
        eventType: CouponIssuedListTableState.coupon.type,
      };
      const { status } = await APICoupon.createIssuedCoupon(
        CouponInput,
      );
      if (status === 200) {
        dispatch({
          type: CouponIssuedListTableActionKind.LOADING,
          payload: false,
        });
        getIssuedCouponList();
        getIssuedCouponListLength();
        getIsusedCouponLength();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 발급된 쿠폰 리스트
  const getIssuedCouponList = async () => {
    dispatch({
      type: CouponIssuedListTableActionKind.LOADING,
      payload: true,
    });
    try {
      const { data, status } = await APICoupon.getIssuedCoupon(
        CouponIssuedListTableState.query,
        CouponIssuedListTableState.sort,
        couponId,
      );
      if (status === 200) {
        dispatch({
          type: CouponIssuedListTableActionKind.GET_ISSUED_COUPON,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* 발급된 쿠폰 개수
  const getIssuedCouponListLength = useCallback(async () => {
    dispatch({ type: CouponIssuedListTableActionKind.LOADING });
    try {
      const { data, status } = await APICoupon.getIssuedCouponLength(
        couponId,
      );
      if (status === 200) {
        dispatch({
          type: CouponIssuedListTableActionKind.GET_ISSUED_COUPON_LENGTH,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [couponId]);

  //* 사용된 쿠폰 개수,
  const getIsusedCouponLength = useCallback(async () => {
    dispatch({ type: CouponIssuedListTableActionKind.LOADING });
    try {
      const { data, status } = await APICoupon.getIsusedCouponLength(
        couponId,
      );
      if (status === 200) {
        dispatch({
          type: CouponIssuedListTableActionKind.GET_ISUSED_LENGTH,
          payload: data.length,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [couponId]);

  //* 유효 기간 변경 함수
  const handleChangeExpirationDate = (event) => {
    const newDate = expirationDate(event.target.value);
    dispatch({
      type: CouponIssuedListTableActionKind.CHANGE_EXPIRATIONDATE,
      payload: newDate,
    });
  };

  //* 사용여부 필터
  const handleIsused = async (event) => {
    if (event.target.value === '0,1') {
      dispatch({
        type: CouponIssuedListTableActionKind.CHANGE_ISUSED,
        payload: [0, 1],
      });
    } else {
      dispatch({
        type: CouponIssuedListTableActionKind.CHANGE_ISUSED,
        payload: event.target.value,
      });
    }
  };

  //* 쿠폰 삭제
  const handleDelete = async () => {
    dispatch({ type: CouponIssuedListTableActionKind.LOADING });
    try {
      await Promise.all(
        CouponIssuedListTableState.selected.map(async (data) => {
          return await APICoupon.deleteIssuedCoupon(data);
        }),
      );
      dispatch({
        type: CouponIssuedListTableActionKind.CLOSE_DELETE_DIALOG,
      });
      toast.success('쿠폰이 삭제 됐습니다.');
      dispatch({
        type: CouponIssuedListTableActionKind.SELECT_COUPON,
        payload: [],
      });
      getIssuedCouponList();
      getIssuedCouponListLength();
    } catch (error) {
      console.log(error);
    }
  };

  //* 쿠폰 선택
  const handleSelect = (event: any, selectId: number): void => {
    if (!CouponIssuedListTableState.selected.includes(selectId)) {
      let newSelect = CouponIssuedListTableState.selected;
      newSelect.push(selectId);
      dispatch({
        type: CouponIssuedListTableActionKind.SELECT_COUPON,
        payload: newSelect,
      });
    } else {
      let data = CouponIssuedListTableState.selected.filter(
        (id) => id !== selectId,
      );
      dispatch({
        type: CouponIssuedListTableActionKind.SELECT_COUPON,
        payload: data,
      });
    }
  };

  //* 모든 쿠폰 선택
  const handleSelectAll = (event: any): void => {
    let data = event.target.checked
      ? CouponIssuedListTableState.list.map((list) => list.id)
      : [];
    dispatch({
      type: CouponIssuedListTableActionKind.SELECT_COUPON,
      payload: data,
    });
  };

  useEffect(
    () => {
      getIssuedCouponList();
      getIssuedCouponListLength();
      getIsusedCouponLength();
      getCoupon();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      getIssuedCouponListLength,
      CouponIssuedListTableState.query,
      CouponIssuedListTableState.sort,
    ],
  );
  const workSheetColumnNames = [
    'id',
    'code',
    'displayName',
    'name',
    'agency',
    'type',
    'applyDays',
    'issuedDate',
    'created_at',
    'expirationDate',
    'issuedBy',
    'userId',
    'isUsed',
    'usedDate',
  ];

  //* 엑셀파일 데이터 불러오기
  const fileDownload = async () => {
    const { data: xlsxData } = await APICoupon.getAllList(couponId);
    exportUsersToExcel(xlsxData, workSheetColumnNames);
  };

  //* 엑셀파일로 다운받기
  const exportExcel = (data, workSheetColumnNames, workSheetName) => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const workBook = XLSX.utils.book_new();
    const workSheetData = [workSheetColumnNames, ...data];
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
    const excelBuffer = XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data2 = new Blob([excelBuffer], { type: fileType });
    saveAs(data2, `file${fileExtension}`);
  };

  //* 엑셀파일로 컬럼명
  const exportUsersToExcel = (
    users?,
    workSheetColumnNames?,
    workSheetName?,
  ) => {
    const data = users.map((user) => {
      return [
        user.id,
        user.code,
        user.coupon.displayName,
        user.coupon.name,
        user.coupon.agency,
        user.coupon.type,
        user.coupon.applyDays,
        user.issuedDate,
        user.created_at,
        user.expirationDate,
        user.issuedBy.username,
        user.userId,
        user.isUsed,
        user.usedDate,
      ];
    });
    exportExcel(data, workSheetColumnNames, workSheetName);
  };

  return (
    <CouponIssuedListTablePresenter
      CouponIssuedListTableState={CouponIssuedListTableState}
      dispatch={dispatch}
      handleDelete={handleDelete}
      handleIsused={handleIsused}
      handleSelect={handleSelect}
      handleSelectAll={handleSelectAll}
      addIssuedCoupon={addIssuedCoupon}
      handleChangeExpirationDate={handleChangeExpirationDate}
      fileDownload={fileDownload}
    />
  );
};

export default CouponIssuedListTableContainer;
