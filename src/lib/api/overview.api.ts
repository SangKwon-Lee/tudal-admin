import axios from 'src/lib/axios';
import { INews } from 'src/types/news';
import { Schedule } from 'src/types/schedule';
import dayjs from 'dayjs';

export async function getNews() {
  return await axios.get<INews[]>(
    '/general-news?_sort=created_at:DESC&isSelected=1&_limit=10',
  );
}

export async function getSchedules(today) {
  return await axios.get<Schedule[]>(
    `/schedules?_startDate=${today}&_limit=5&_sort=priority:DESC`,
  );
}
// * 공통 API(통합, 개인)
// * 달인들 전체 리스트 불러오기
export const getDarins = () => {
  return axios.get(`/masters`);
};

// * 개인 정산페이지를 위한 API
export const getDarin = (masterId) => {
  return axios.get(`/masters/${masterId}`);
};

export const getSubnum = (masterId) => {
  return axios.get(
    `/master-subscriptions/count?master=${masterId}&isSub=1`,
  );
};

export const getSubnumchart = (masterId) => {
  return axios.get(
    `/master-subscriptions?master=${masterId}&isSub=1&created_at_gte=${dayjs(
      new Date(),
    )
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
  );
};

export const getPaidnum = (masterId) => {
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  return axios.get(
    `/master-payments/count?master=${masterId}&endDate_gte=${today}`,
  );
};

export const getPaidnumchart = (masterId) => {
  return axios.get(
    `/master-payments?master=${masterId}&created_at_gte=${dayjs(
      new Date(),
    )
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
  );
};

export const getTotalpaidnum = (masterId) => {
  return axios.get(`/master-payments/count?master=${masterId}`);
};

export const getPaidchart = (masterId) => {
  return axios.get(
    `/master-payments?_sort=created_at:asc&master=${masterId}&created_at_gte=${dayjs(
      new Date(),
    )
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
  );
};

export const getTotalfeednum = (masterId) => {
  return axios.get(`/master-feeds/count?master=${masterId}`);
};

export const getMonthlyfeednum = (masterId) => {
  return axios.get(
    `/master-feeds/count?master=${masterId}&created_at_gte=${dayjs(
      new Date(),
    )
      .set('date', 1)
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(new Date())
      .set('date', 31)
      .format('YYYY-MM-DD')}`,
  );
};

export const getTotalhiddenorder = (masterId) => {
  return axios.get(
    `/hidden-report-orders/count?master_report.master_id=${masterId}`,
  );
};

export const getTotalhiddennum = (masterId) => {
  return axios.get(`/master-reports/count?master_id=${masterId}`);
};

export const getHiddenchart = (masterId) => {
  return axios.get(
    `/hidden-report-orders?master_report.master_id=${masterId}&created_at_gte=${dayjs(
      new Date(),
    )
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
  );
};

// * 통합 정산페이지를 위한 API 모음
// * axios 호출할 때 where 조건문에 master_id를 없애면 간단하게 API를 만들 수 있다.
// * 상수 이름은 기존에 개인 정산페이지에 사용되는 API에 C를 붙여서 만들어줌.

export const getCSubnum = () => {
  return axios.get(`/master-subscriptions/count?isSub=1`);
};
// * 2주치 데이터만 가져옴

export const getCSubnumchart = () => {
  return axios.get(
    `/master-subscriptions?isSub=1&created_at_gte=${dayjs(new Date())
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
    { params: { _limit: 10000 } },
    // limit는 현재 front에서 그래프를 만들기 위해서는 어쩔 수 없이 필요한 부분 추후 개선 가능.
    // 용석님의 가르침 : 이런 커스텀 API 호출 이외에 백엔드에서 sql문법을 가지고 더 깨끗한 코딩을 짤 수 있다.
    // 하지만 가져올 내용이 복잡해지면 백엔드에서도 복잡해지는건 마찬가지이다.
    // 프론트와 백의 경계선을 조금 더 명확하게 하기 위해서 이런한 작업을 백엔드에서 처리해주는 것이지만
    // 사실 프론트에서 할 수 있지만 코드가 더러워질 수 있다.
  );
};

export const getCPaidnum = () => {
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  return axios.get(`/master-payments/count?endDate_gte=${today}`);
};

export const getCPaidnumchart = () => {
  return axios.get(
    `/master-payments?created_at_gte=${dayjs(new Date())
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
  );
};

export const getCTotalpaidnum = () => {
  return axios.get(`/master-payments/count?`);
};

export const getCTotalpaidamount = () => {
  // * 실제로 총 결제액을 계산하는 로직은 Container에 위치
  // * 이 API는 masters에서 type이 paid이면서 price_gold가 1이상인 달인들만 불러옴.
  return axios.get(`/masters?type=paid&price_gold_gte=1`);
};

export const getCPaidchart = () => {
  return axios.get(
    `/master-payments?_sort=created_at:asc&created_at_gte=${dayjs(
      new Date(),
    )
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
  );
};

export const getCTotalfeednum = () => {
  return axios.get(`/master-feeds/count?`);
};

export const getCMonthlyfeednum = () => {
  return axios.get(
    `/master-feeds/count?created_at_gte=${dayjs(new Date())
      .set('date', 1)
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(new Date())
      .set('date', 31)
      .format('YYYY-MM-DD')}`,
  );
};

export const getCTotalhiddenorder = () => {
  return axios.get(`/hidden-report-orders/count?`);
};

export const getCTotalhiddennum = () => {
  return axios.get(`/master-reports/count?`);
};

export const getCHiddenchart = () => {
  return axios.get(
    `/hidden-report-orders?&created_at_gte=${dayjs(new Date())
      .subtract(13, 'day')
      .format('YYYY-MM-DD')}&created_at_lte=${dayjs(
      new Date(),
    ).format('YYYY-MM-DD')}`,
  );
};
