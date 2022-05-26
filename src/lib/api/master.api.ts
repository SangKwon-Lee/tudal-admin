import axios from '../axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';
import { IMaster, IMasterFeed, IMasterRoom } from 'src/types/master';

/** 구 버전 달인 (에디터) */
// export async function getList() {
//   const expertFeeds = await axios.get(
//     `/expert-feeds?&_sort=created_at:DESC&_start=0&_limit=10000`,
//   );

//   return expertFeeds;
// }

export async function getFeeds(params?, masterId?) {
  let query = qs.stringify(removeEmpty(params));
  return await axios.get<IMasterFeed[]>(
    `/master-feeds?master.id=${masterId}&${query}`,
  );
}

export async function getFeedLength(masterId, roomId) {
  return await axios.get(
    `/master-feeds/count?master.id=${masterId}&master_room.id=${roomId}`,
  );
}

// deprecated
export async function getRoomsByChannel(channelId) {
  return await axios.get<IMasterRoom[]>(
    `/master-rooms?master_channel.id=${channelId}&isDeleted=0`,
  );
}
export async function getRoomsByMaster(masterId) {
  return await axios.get<IMasterRoom[]>(
    `/master-rooms?master.id=${masterId}&isDeleted=0`,
  );
}

export async function deleteFeed(id) {
  return axios.delete(`/master-feeds/${id}`);
}

export async function getDetailFeed(feedId) {
  return await axios.get(`/master-feeds/${feedId}`);
}

export async function getDetailFeedLike(feedId) {
  return await axios.get(
    `/master-feed-likes?master_feed.id=${feedId}`,
  );
}

export async function getAllSubscribe(masterId) {
  return await axios.get(
    `/master-subscriptions?master.id=${masterId}`,
  );
}

export async function getYearSubscribe(year, masterId) {
  let monthArr = [];
  if (Number(year) === new Date().getFullYear()) {
    for (let i = 1; i < new Date().getMonth() + 2; i++) {
      if (i.toString().length === 1) {
        monthArr.push('0' + i.toString());
      } else {
        monthArr.push(i.toString());
      }
    }
  } else {
    monthArr = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
  }

  const data = await Promise.all(
    monthArr.map(async (month) => {
      let date = new Date(year, Number(month), 0).getDate();
      return await axios.get(
        `/master-subscriptions?startDate_gte=2020-01-01&startDate_lte=${year}-${month}-${date}&master.id=${masterId}`,
      );
    }),
  );
  return data;
}

export async function getThisMonth(masterId) {
  const year = new Date().getFullYear();
  let thisMonth: any = new Date().getMonth() + 1;
  let lastMonth: any = new Date().getMonth();
  if (thisMonth.toString().length === 1) {
    thisMonth = `0${thisMonth}`;
  }
  if (lastMonth.toString().length === 1) {
    lastMonth = `0${lastMonth}`;
  }
  const thisDate = new Date(year, thisMonth, 0).getDate();
  const lastDate = new Date(year, lastMonth, 0).getDate();
  const This = await axios.get(
    `/master-subscriptions/?startDate_gte=${year}-${thisMonth}-01&startDate_lte=${year}-${thisMonth}-${thisDate}&master.id=${masterId}`,
  );
  const Last = await axios.get(
    `/master-subscriptions/?startDate_gte=${year}-${lastMonth}-01&startDate_lte=${year}-${lastMonth}-${lastDate}&master.id=${masterId}`,
  );

  return [This, Last];
}

export async function getMasters(userId) {
  return await axios.get<IMaster[]>(`/masters?user=${userId}`);
}

export async function getMasterList() {
  return await axios.get<IMaster[]>(`/masters`);
}

// 정산
export async function getMasterPayments(masterId, query?) {
  return await axios.get(
    `/master-payments/calculation/${masterId}&startDate=${query.startDate}&endDate=${query.endDate}`,
  );
}

// 공지사항
export async function getMasterNotice(noticeId, userId) {
  return await axios.get(
    `/master-notices/${noticeId}?master.user=${userId}`,
  );
}

export async function postMasterNotice(notice) {
  return await axios.post(`/master-notices`, notice);
}

export async function editMasterNotice(noticeId, notice) {
  return await axios.put(`/master-notices/${noticeId}`, notice);
}

export async function getMasterNoticeList(param) {
  let query = qs.stringify(removeEmpty(param));
  return await axios.get(`/master-notices?${query}`);
}

export async function deleteMasterNotice(noticeId) {
  return await axios.delete(`/master-notices/${noticeId}`);
}

export async function getMasterMoticeListLength() {
  return await axios.get(`/master-notices/count`);
}
