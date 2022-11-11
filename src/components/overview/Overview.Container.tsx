import React, { useCallback, useEffect, useReducer } from 'react';
import OverviewPresenter from './Overview.Presenter';
import dayjs from 'dayjs';
import { APIOverview } from 'src/lib/api';
// import useAuth from 'src/hooks/useAuth';
import { IMaster } from 'src/types/master';

export enum OverviewActionKind {
  LOADING = 'LOADING',

  // * 달인 리스트 불러오기
  GET_DARINS = 'GET_DARINS',
  // * 2주 날짜 리스트 생성
  GET_DATES = 'GET_DATES',

  // * 달인 개인 정산페이지
  // * 달인 선택해서 개인 정보 불러오기
  GET_DARIN = 'GET_DARIN',
  // * 선택된 달인 구독자 수 불러오기
  GET_SUBNUM = 'GET_SUBNUM',
  // * 선택된 달인 구독자 수 차트 데이터 불러오기
  GET_SUBNUMCHART = 'GET_SUBNUMCHART',
  // * 선택된 달인 유료 이용자 수 불러오기
  GET_PAIDNUM = 'GET_PAIDNUM',
  // * 선택된 달인 유료 이용자 수 차트 데이터 불러오기
  GET_PAIDNUMCHART = 'GET_PAIDNUMCHART',
  // * 선택된 달인의 총 결제 횟수 불러오기
  GET_TOTALPAIDNUM = 'GET_TOTALPAIDNUM',
  // * 선택된 달인의 결제현황 차트 데이터 불러오기
  GET_PAIDCHART = 'GET_PAIDCHART',
  // * 선택된 달인 총 피드 개수 불러오기
  GET_TOTALFEEDNUM = 'GET_TOTALFEEDNUM',
  // * 선택된 달인 월별 피드 개수 불러오기
  GET_MONTHLYFEEDNUM = 'GET_MONTHLYFEEDNUM',
  // * 선택된 달인 누적 히든리포트 결제 횟수 불러오기
  GET_TOTALHIDDENORDER = 'GET_TOTALHIDDENORDER',
  // * 선택된 달인 누적 히든리포트 개수 불러오기
  GET_TOTALHIDDENNUM = 'GET_TOTALHIDDENNUM',
  // * 선택된 달인의 히든리포트 현황 차트 데이터 불러오기
  GET_HIDDENCHART = 'GET_HIDDENCHART,',

  // * 통합 정산페이지
  // * 전체 구독자 수 불러오기
  GET_CSUBNUM = 'GET_CSUBNUM',
  // * 전체 구독자 수 차트 데이터 불러오기
  GET_CSUBNUMCHART = 'GET_CSUBNUMCHART',
  // * 전체 유료 이용자 수 불러오기
  GET_CPAIDNUM = 'GET_CPAIDNUM',
  // * 전체 유료 이용자 수 차트 데이터 불러오기
  GET_CPAIDNUMCHART = 'GET_CPAIDNUMCHART',
  // * 전체 총 결제 횟수 불러오기
  GET_CTOTALPAIDNUM = 'GET_CTOTALPAIDNUM',
  // * 유료 및 골드가격이 책정된 달인들 불러오기
  GET_CTOTALPAIDAMOUNT = 'GET_CTOTALPAIDAMOUNT',
  // * 전체 결제현황 차트 데이터 불러오기
  GET_CPAIDCHART = 'GET_CPAIDCHART',
  // * 전체 총 피드 개수 불러오기
  GET_CTOTALFEEDNUM = 'GET_CTOTALFEEDNUM',
  // * 전체 월별 피드 개수 불러오기
  GET_CMONTHLYFEEDNUM = 'GET_CMONTHLYFEEDNUM',
  // * 전체 누적 히든리포트 결제 횟수 불러오기
  GET_CTOTALHIDDENORDER = 'GET_CTOTALHIDDENORDER',
  // * 전체 누적 히든리포트 개수 불러오기
  GET_CTOTALHIDDENNUM = 'GET_CTOTALHIDDENNUM',
  // * 전체 히든리포트 현황 차트 데이터 불러오기
  GET_CHIDDENCHART = 'GET_CHIDDENCHART',
}

export interface OverviewAction {
  type: OverviewActionKind;
  payload?: any;
}

export interface OverviewState {
  loading: boolean;
  users: IMaster[];
  dates: [];
  darin: IMaster;
  subnum: number;
  subnumchart: [];
  paidnum: number;
  paidnumchart: [];
  totalpaidnum: number;
  paidchart: [];
  totalfeednum: number;
  monthlyfeednum: number;
  totalhiddenorder: number;
  totalhiddennum: number;
  hiddenchart: [];
  csubnum: number;
  csubnumchart: [];
  cpaidnum: number;
  cpaidnumchart: [];
  ctotalpaidnum: number;
  ctotalpaidamount: number;
  cpaidchart: [];
  ctotalfeednum: number;
  cmonthlyfeednum: number;
  ctotalhiddenorder: number;
  ctotalhiddennum: number;
  chiddenchart: [];
}
const initialState: OverviewState = {
  loading: false,
  users: [],
  dates: null,
  darin: null,
  subnum: null,
  subnumchart: null,
  paidnum: null,
  paidnumchart: null,
  totalpaidnum: null,
  paidchart: null,
  totalfeednum: null,
  monthlyfeednum: null,
  totalhiddenorder: null,
  totalhiddennum: null,
  hiddenchart: null,
  csubnum: null,
  csubnumchart: null,
  cpaidnum: null,
  cpaidnumchart: null,
  ctotalpaidnum: null,
  ctotalpaidamount: null,
  cpaidchart: null,
  ctotalfeednum: null,
  cmonthlyfeednum: null,
  ctotalhiddenorder: null,
  ctotalhiddennum: null,
  chiddenchart: null,
};

const OverviewReducer = (
  state: OverviewState,
  action: OverviewAction,
): OverviewState => {
  const { type, payload } = action;
  switch (type) {
    // * 공통
    case OverviewActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case OverviewActionKind.GET_DARINS:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case OverviewActionKind.GET_DATES:
      return {
        ...state,
        dates: payload,
      };

    // * 달인 개인 정산페이지
    case OverviewActionKind.GET_DARIN:
      return {
        ...state,
        darin: payload,
      };
    case OverviewActionKind.GET_SUBNUM:
      return {
        ...state,
        subnum: payload,
      };
    case OverviewActionKind.GET_SUBNUMCHART:
      return {
        ...state,
        subnumchart: payload,
      };
    case OverviewActionKind.GET_PAIDNUM:
      return {
        ...state,
        paidnum: payload,
      };
    case OverviewActionKind.GET_PAIDNUMCHART:
      return {
        ...state,
        paidnumchart: payload,
      };
    case OverviewActionKind.GET_TOTALPAIDNUM:
      return {
        ...state,
        totalpaidnum: payload,
      };
    case OverviewActionKind.GET_PAIDCHART:
      return {
        ...state,
        paidchart: payload,
      };
    case OverviewActionKind.GET_TOTALFEEDNUM:
      return {
        ...state,
        totalfeednum: payload,
      };
    case OverviewActionKind.GET_MONTHLYFEEDNUM:
      return {
        ...state,
        monthlyfeednum: payload,
      };
    case OverviewActionKind.GET_TOTALHIDDENORDER:
      return {
        ...state,
        totalhiddenorder: payload,
      };
    case OverviewActionKind.GET_TOTALHIDDENNUM:
      return {
        ...state,
        totalhiddennum: payload,
      };
    case OverviewActionKind.GET_HIDDENCHART:
      return {
        ...state,
        hiddenchart: payload,
      };

    // * 통합 정산페이지
    case OverviewActionKind.GET_CSUBNUM:
      return {
        ...state,
        csubnum: payload,
      };
    case OverviewActionKind.GET_CSUBNUMCHART:
      return {
        ...state,
        csubnumchart: payload,
      };
    case OverviewActionKind.GET_CPAIDNUM:
      return {
        ...state,
        cpaidnum: payload,
      };
    case OverviewActionKind.GET_CPAIDNUMCHART:
      return {
        ...state,
        cpaidnumchart: payload,
      };
    case OverviewActionKind.GET_CTOTALPAIDNUM:
      return {
        ...state,
        ctotalpaidnum: payload,
      };
    case OverviewActionKind.GET_CTOTALPAIDAMOUNT:
      return {
        ...state,
        ctotalpaidamount: payload,
      };
    case OverviewActionKind.GET_CPAIDCHART:
      return {
        ...state,
        cpaidchart: payload,
      };
    case OverviewActionKind.GET_CTOTALFEEDNUM:
      return {
        ...state,
        ctotalfeednum: payload,
      };
    case OverviewActionKind.GET_CMONTHLYFEEDNUM:
      return {
        ...state,
        cmonthlyfeednum: payload,
      };
    case OverviewActionKind.GET_CTOTALHIDDENORDER:
      return {
        ...state,
        ctotalhiddenorder: payload,
      };
    case OverviewActionKind.GET_CTOTALHIDDENNUM:
      return {
        ...state,
        ctotalhiddennum: payload,
      };
    case OverviewActionKind.GET_CHIDDENCHART:
      return {
        ...state,
        chiddenchart: payload,
      };
  }
};
interface IOverviewProps {
  mode?: string;
}
const OverviewContainer: React.FC<IOverviewProps> = (props) => {
  // * 어떻게 활용하는지 파악 필요.
  // const { user } = useAuth();

  const [overviewState, dispatch] = useReducer(
    OverviewReducer,
    initialState,
  );

  // * query한 데이터들이 overviewState에 잘 들어갔는지 확인하는 용도
  console.log(overviewState);

  // * 공통 상수(들))
  const getDarins = useCallback(async () => {
    dispatch({
      type: OverviewActionKind.LOADING,
      payload: true,
    });
    try {
      const { data } = await APIOverview.getDarins();
      dispatch({
        type: OverviewActionKind.GET_DARINS,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getDates = useCallback(async () => {
    try {
      let twoWeek = [];
      const today = dayjs(new Date());
      for (let i = 14; i > 0; i--) {
        twoWeek.push(
          today.subtract(i, 'd').format('DD MMM').toString(),
        );
      }
      console.log(twoWeek);
      dispatch({
        type: OverviewActionKind.GET_DATES,
        payload: twoWeek,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // * 달인 개인 화면에 해당하는 데이터를 가져오는 API들을 실행하는 상수들
  const getDarin = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getDarin(id);
      dispatch({
        type: OverviewActionKind.GET_DARIN,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const getSubnum = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getSubnum(id);
      dispatch({
        type: OverviewActionKind.GET_SUBNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getSubnumchart = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getSubnumchart(id);
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      const countNum = (table) => {
        let countDiff =
          14 -
          Math.ceil(today.diff(dayjs(table.created_at), 'day', true));
        twoWeeks[countDiff] += 1;
      };
      data.map((table) => countNum(table));
      dispatch({
        type: OverviewActionKind.GET_SUBNUMCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getPaidnum = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getPaidnum(id);
      dispatch({
        type: OverviewActionKind.GET_PAIDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getPaidnumchart = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getPaidnumchart(id);
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      const countNum = (table) => {
        let countDiff =
          14 -
          Math.ceil(today.diff(dayjs(table.created_at), 'day', true));
        twoWeeks[countDiff] += 1;
      };
      data.map((table) => countNum(table));
      dispatch({
        type: OverviewActionKind.GET_PAIDNUMCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTotalpaidnum = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getTotalpaidnum(id);
      dispatch({
        type: OverviewActionKind.GET_TOTALPAIDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getPaidchart = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getPaidchart(id);
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      const countNum = (table) => {
        let countDiff =
          14 -
          Math.ceil(today.diff(dayjs(table.created_at), 'day', true));
        twoWeeks[countDiff] += 1;
      };
      data.map((table) => countNum(table));
      dispatch({
        type: OverviewActionKind.GET_PAIDCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTotalfeednum = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getTotalfeednum(id);
      dispatch({
        type: OverviewActionKind.GET_TOTALFEEDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMonthlyfeednum = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getMonthlyfeednum(id);
      dispatch({
        type: OverviewActionKind.GET_MONTHLYFEEDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTotalhiddenorder = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getTotalhiddenorder(id);
      dispatch({
        type: OverviewActionKind.GET_TOTALHIDDENORDER,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTotalhiddennum = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getTotalhiddennum(id);
      dispatch({
        type: OverviewActionKind.GET_TOTALHIDDENNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getHiddenchart = useCallback(async (id: any) => {
    try {
      const { data } = await APIOverview.getHiddenchart(id);
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      const countNum = (table) => {
        let countDiff =
          14 -
          Math.ceil(today.diff(dayjs(table.created_at), 'day', true));
        twoWeeks[countDiff] += 1;
      };
      data.map((table) => countNum(table));
      dispatch({
        type: OverviewActionKind.GET_HIDDENCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // * 통합 정산페이지에 필요한 데이터를 불러오는 API를 호출하는 상수들.
  // * 위에 달인별 데이터를 불러오는 API에서 master 및 masterId 필터가 없는것을 제외하고 거의 같다.
  // * getCSubnumchart API를 수정하여 더 효율적으로 만들어 볼 필요가 있음.

  const getCSubnum = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCSubnum();
      dispatch({
        type: OverviewActionKind.GET_CSUBNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCSubnumchart = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCSubnumchart();
      // 이 부분은 for 대신 고차함수식을 사용해보면 좋음. map, filter, mapFilter 등등
      // 07-08 For loop is replaced with  countNum and map function
      // Made it even shorter. No separate variable for created_at date.
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      const countNum = (table) => {
        let countDiff =
          14 -
          Math.ceil(today.diff(dayjs(table.created_at), 'day', true));
        twoWeeks[countDiff] += 1;
      };
      data.map((table) => countNum(table));
      dispatch({
        type: OverviewActionKind.GET_CSUBNUMCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCPaidnum = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCPaidnum();
      dispatch({
        type: OverviewActionKind.GET_CPAIDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCPaidnumchart = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCPaidnumchart();
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      for (let i = 0; i < data.length; i++) {
        let diff =
          14 -
          Math.ceil(
            Math.abs(
              dayjs(data[i].created_at).diff(today, 'day', true),
            ),
          );
        twoWeeks[diff]++;
      }
      dispatch({
        type: OverviewActionKind.GET_CPAIDNUMCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCTotalpaidnum = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCTotalpaidnum();
      dispatch({
        type: OverviewActionKind.GET_CTOTALPAIDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCTotalpaidamount = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCTotalpaidamount();
      let grandTotal = 0;
      for (let i = 0; i < data.length; i++) {
        let subTotal =
          data[i].master_payments.length * data[i].price_gold * 100;
        grandTotal += subTotal;
      }
      dispatch({
        type: OverviewActionKind.GET_CTOTALPAIDAMOUNT,
        payload: grandTotal,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCPaidchart = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCPaidchart();
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      const countNum = (table) => {
        let countDiff =
          14 -
          Math.ceil(today.diff(dayjs(table.created_at), 'day', true));
        twoWeeks[countDiff] += 1;
      };
      data.map((table) => countNum(table));
      dispatch({
        type: OverviewActionKind.GET_CPAIDCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCTotalfeednum = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCTotalfeednum();
      dispatch({
        type: OverviewActionKind.GET_CTOTALFEEDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCMonthlyfeednum = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCMonthlyfeednum();
      dispatch({
        type: OverviewActionKind.GET_CMONTHLYFEEDNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCTotalhiddenorder = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCTotalhiddenorder();
      dispatch({
        type: OverviewActionKind.GET_CTOTALHIDDENORDER,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCTotalhiddennum = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCTotalhiddennum();
      dispatch({
        type: OverviewActionKind.GET_CTOTALHIDDENNUM,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCHiddenchart = useCallback(async () => {
    try {
      const { data } = await APIOverview.getCHiddenchart();
      let twoWeeks = new Array(14).fill(0);
      let today = dayjs(new Date());
      const countNum = (table) => {
        let countDiff =
          14 -
          Math.ceil(today.diff(dayjs(table.created_at), 'day', true));
        twoWeeks[countDiff] += 1;
      };
      data.map((table) => countNum(table));
      dispatch({
        type: OverviewActionKind.GET_CHIDDENCHART,
        payload: twoWeeks,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // * 통합 정산페이지에 필요한 데이터를 불어오기 위해서 페이지가 로딩되기 이전에 실행한다.
  // * 더 효율적인 방법이 없는지 찾아봐야함 (리팩토링 시급)
  useEffect(() => {
    getDarins();
    getDates();
    getCSubnum();
    getCSubnumchart();
    getCPaidnum();
    getCPaidnumchart();
    getCPaidchart();
    getCTotalpaidnum();
    getCTotalpaidamount();
    getCMonthlyfeednum();
    getCTotalfeednum();
    getCTotalhiddennum();
    getCHiddenchart();
    getCTotalhiddenorder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <OverviewPresenter
      dispatch={dispatch}
      getDarin={getDarin}
      getSubnum={getSubnum}
      getSubnumchart={getSubnumchart}
      getPaidnum={getPaidnum}
      getPaidnumchart={getPaidnumchart}
      getTotalpaidnum={getTotalpaidnum}
      getPaidchart={getPaidchart}
      getTotalfeednum={getTotalfeednum}
      getMonthlyfeednum={getMonthlyfeednum}
      getTotalhiddenorder={getTotalhiddenorder}
      getTotalhiddennum={getTotalhiddennum}
      getHiddenchart={getHiddenchart}
      overviewState={overviewState}
    />
  );
};

export default OverviewContainer;
